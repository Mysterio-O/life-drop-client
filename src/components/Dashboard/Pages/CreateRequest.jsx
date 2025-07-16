import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useUserStatus from '../../../hooks/useUserStatus';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const CreateRequest = () => {

    const axiosSecure = useAxiosSecure();

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const { status, status_loading } = useUserStatus();
    // console.log(status);

    const navigate = useNavigate();

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            requesterName: user?.displayName || '',
            requesterEmail: user?.email || '',
        },
    });

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch('division');
    const selectedDistrict = watch('district');

    useEffect(() => {
        fetch('/division.json')
            .then(res => res.json())
            .then(data => setDivisions(data))
            .catch(err => console.log('error fetching division data', err));
        fetch('/district.json')
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.log('error fetching districts data', err));
        fetch('/upazilas.json')
            .then(res => res.json())
            .then(data => setUpazilas(data))
            .catch(err => console.log('error fetching upazilas data', err));


        document.title = 'Create Request';

    }, []);

    const filteredDistricts = districts.filter(d => d.division_id === selectedDivision);
    const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

    const onSubmit = async (data) => {
        setLoading(true);
        const division = divisions.find(div => div.id === data.division);
        const district = districts.find(dis => dis.id === data.district);
        // console.log(division,district);
        const donationRequest = {
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        donationRequest.division = division.name;
        donationRequest.district = district.name;

        console.log(donationRequest);

        // You can send it to your server here using axiosSecure
        // await axiosSecure.post('/donation-requests', donationRequest);
        try {
            const res = await axiosSecure.post('/create-request', donationRequest)
            // console.log(res.data);
            if (res.data.result.insertedId) {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Request Submitted!',
                    text: 'Your donation request has been created.',
                    confirmButtonColor: '#111827',
                    customClass: {
                        confirmButton: 'dark:bg-[#F8FAFC]',
                    },
                });
            }
        }
        catch (error) {
            setLoading(false);
            console.log('error adding new blood request', error);
        }



        reset({
            requesterName: user?.displayName || '',
            requesterEmail: user?.email || '',
            recipientName: '',
            recipientNumber: '',
            division: '',
            district: '',
            upazila: '',
            hospitalName: '',
            address: '',
            bloodGroup: '',
            donationDate: '',
            donationTime: '',
            requestMessage: '',
        });
    };

    if (status_loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md space-y-6"
            >
                {[...Array(11)].map((_, idx) => (
                    <div key={idx} className="flex flex-col space-y-2">
                        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
                        {idx === 10 && (
                            <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md"></div>
                        )}
                    </div>
                ))}
            </motion.div>
        )
    };





    if (status === 'blocked') {

        const handleContactAdmin = () => {
            if (window.location.pathname === '/#contact-us') {
                const element = document.getElementById('contact-us');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                } else {
                    setTimeout(() => {
                        const retryElement = document.getElementById('contact-us');
                        if (retryElement) {
                            retryElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 500);
                }
            }
            else {
                navigate('/#contact-us');
            }
        }



        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A] p-4 overflow-hidden"
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-md w-full bg-[#D32F2F] dark:bg-[#EF5350] p-8 rounded-xl shadow-md text-center text-white"
                >
                    <FaExclamationTriangle className="text-4xl mb-4 mx-auto" />
                    <h2 className="text-xl font-bold mb-2">Account Blocked</h2>
                    <p className="mb-4">Your account is currently blocked. You cannot create a request at this time.</p>
                    <p className="mb-4">Please contact the admin for more information.</p>
                    <span onClick={handleContactAdmin} className="text-[#F8FAFC] cursor-pointer">Contact Admin</span>
                </motion.div>
            </motion.div>
        );
    }




    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A] p-4 overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                    Create Blood Donation Request
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <input
                            {...register('requesterName', { required: 'Requester name is required' })}
                            value={user?.displayName}
                            readOnly
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-[#E5E7EB] dark:bg-[#334155] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] cursor-not-allowed`}
                        />
                        {errors.requesterName && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.requesterName.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <input
                            {...register('requesterEmail', { required: 'Requester email is required' })}
                            value={user?.email}
                            readOnly
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-[#E5E7EB] dark:bg-[#334155] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] cursor-not-allowed`}
                        />
                        {errors.requesterEmail && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.requesterEmail.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            {...register('recipientName', { required: 'Recipient name is required' })}
                            placeholder="Recipient Name"
                            type='text'
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.recipientName && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.recipientName.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            {...register('recipientNumber', { required: 'Recipient number is required' })}
                            placeholder="Recipient Number"
                            type='number'
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.recipientNumber && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.recipientNumber.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <select
                            {...register('division', { required: 'Division is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Division</option>
                            {divisions.map((division) => (
                                <option key={division.id} value={division.id}>
                                    {division.name}
                                </option>
                            ))}
                        </select>
                        {errors.division && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.division.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <select
                            {...register('district', { required: 'District is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select District</option>
                            {filteredDistricts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.district.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <select
                            {...register('upazila', { required: 'Upazila is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map((upazila) => (
                                <option key={upazila.id} value={upazila.name}>
                                    {upazila.name}
                                </option>
                            ))}
                        </select>
                        {errors.upazila && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.upazila.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <input
                            {...register('hospitalName', { required: 'Hospital name is required' })}
                            placeholder="Hospital Name"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.hospitalName && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.hospitalName.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <input
                            {...register('address', { required: 'Address is required' })}
                            placeholder="Full Address Line"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.address && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.address.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <select
                            {...register('bloodGroup', { required: 'Blood group is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.bloodGroup.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        <input
                            type="date"
                            {...register('donationDate', { required: 'Donation date is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.donationDate && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.donationDate.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <input
                            type="time"
                            {...register('donationTime', { required: 'Donation time is required' })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.donationTime && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.donationTime.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <textarea
                            {...register('requestMessage', { required: 'Request message is required' })}
                            placeholder="Why do you need the blood?"
                            className="textarea w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                            rows="4"
                        />
                        {errors.requestMessage && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.requestMessage.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                    >
                        <motion.button
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            type="submit"
                            className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors cursor-pointer"
                        >
                            {
                                !loading ? "Create Request" : <span className="loading loading-spinner loading-xl"></span>
                            }
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateRequest;