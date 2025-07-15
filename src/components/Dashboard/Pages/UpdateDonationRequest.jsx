import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate, useParams } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateDonationRequest = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { data: request, isLoading } = useQuery({
        queryKey: ['request', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-request/${id}`);
            return res.data;
        }
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            requesterName: '',
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
        },
    });

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const selectedDivision = watch('division');
    const selectedDistrict = watch('district');

    useEffect(() => {
        // Load JSON data
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
    }, []);

    useEffect(() => {
        // Set initial values when request and JSON data are available
        if (request && divisions.length > 0 && districts.length > 0) {
            register('requesterName', { required: 'Requester name is required' });
            register('requesterEmail', { required: 'Requester email is required' });
            register('recipientName', { required: 'Recipient name is required' });
            register('recipientNumber', { required: 'Recipient number is required' });
            register('division', { required: 'Division is required' });
            register('district', { required: 'District is required' });
            register('upazila', { required: 'Upazila is required' });
            register('hospitalName', { required: 'Hospital name is required' });
            register('address', { required: 'Address is required' });
            register('bloodGroup', { required: 'Blood group is required' });
            register('donationDate', { required: 'Donation date is required' });
            register('donationTime', { required: 'Donation time is required' });
            register('requestMessage', { required: 'Request message is required' });

            setValue('requesterName', request.requesterName || '');
            setValue('requesterEmail', request.requesterEmail || '');
            setValue('recipientName', request.recipientName || '');
            setValue('recipientNumber', request.recipientNumber || '');
            setValue('division', divisions.find(d => d.name === request.division)?.id || '');
            setValue('district', districts.find(d => d.name === request.district)?.id || '');
            setValue('upazila', request.upazila || '');
            setValue('hospitalName', request.hospitalName || '');
            setValue('address', request.address || '');
            setValue('bloodGroup', request.bloodGroup || '');
            setValue('donationDate', request.donationDate || '');
            setValue('donationTime', request.donationTime || '');
            setValue('requestMessage', request.requestMessage || '');
        }
    }, [request, divisions, districts, setValue, register]);

    const filteredDistricts = districts.filter(d => d.division_id === selectedDivision);
    const filteredUpazilas = upazilas.filter(u => u.district_id === selectedDistrict);

    const onSubmit = async (data) => {
        setLoading(true);
        const division = divisions.find(div => div.id === data.division);
        const district = districts.find(dis => dis.id === data.district);
        const updatedRequest = {
            recipientName: data.recipientName,
            recipientNumber: data.recipientNumber,
            division: division?.name || request.division,
            district: district?.name || request.district,
            upazila: data.upazila,
            hospitalName: data.hospitalName,
            address: data.address,
            bloodGroup: data.bloodGroup,
            donationDate: data.donationDate,
            donationTime: data.donationTime,
            requestMessage: data.requestMessage,
            requesterName: request.requesterName,
            requesterEmail: request.requesterEmail,
            status: 'pending',
            updatedAt: new Date().toISOString(),
        };

        try {
            const res = await axiosSecure.patch(`/donation-request/${id}`, updatedRequest);
            if (res.data.modifiedCount > 0) {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Request Updated!',
                    text: 'Your donation request has been updated.',
                    confirmButtonColor: '#111827',
                    customClass: {
                        confirmButton: 'dark:bg-[#F8FAFC]',
                    },
                });
                navigate(-1); // Go back to previous page
            }
        } catch (error) {
            setLoading(false);
            console.log('error updating donation request', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'An error occurred while updating the request.',
                confirmButtonColor: '#D32F2F',
                customClass: {
                    confirmButton: 'dark:bg-[#EF5350]',
                },
            });
        }
    };

    if (isLoading) {
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
                    Update Blood Donation Request
                </h2>
                <motion.button
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </motion.button>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <input
                            {...register('requesterName', { required: 'Requester name is required' })}
                            defaultValue={request?.requesterName || ''}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
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
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            {...register('requesterEmail', { required: 'Requester email is required' })}
                            defaultValue={request?.requesterEmail || ''}
                            readOnly
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-[#E5E7EB] dark:bg-[#334155] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] cursor-not-allowed"
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
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            {...register('recipientName', { required: 'Recipient name is required' })}
                            defaultValue={request?.recipientName || ''}
                            placeholder="Recipient Name"
                            type="text"
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
                        transition={{ delay: 0.5 }}
                    >
                        <input
                            {...register('recipientNumber', { required: 'Recipient number is required' })}
                            defaultValue={request?.recipientNumber || ''}
                            placeholder="Recipient Number"
                            type="number"
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
                        transition={{ delay: 0.6 }}
                    >
                        <select
                            {...register('division', { required: 'Division is required' })}
                            defaultValue={divisions.find(d => d.name === request?.division)?.id || ''}
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
                        transition={{ delay: 0.7 }}
                    >
                        <select
                            {...register('district', { required: 'District is required' })}
                            defaultValue={districts.find(d => d.name === request?.district)?.id || ''}
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
                        transition={{ delay: 0.8 }}
                    >
                        <select
                            {...register('upazila', { required: 'Upazila is required' })}
                            defaultValue={request?.upazila || ''}
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
                        transition={{ delay: 0.9 }}
                    >
                        <input
                            {...register('hospitalName', { required: 'Hospital name is required' })}
                            defaultValue={request?.hospitalName || ''}
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
                        transition={{ delay: 1.0 }}
                    >
                        <input
                            {...register('address', { required: 'Address is required' })}
                            defaultValue={request?.address || ''}
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
                        transition={{ delay: 1.1 }}
                    >
                        <select
                            {...register('bloodGroup', { required: 'Blood group is required' })}
                            defaultValue={request?.bloodGroup || ''}
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
                        transition={{ delay: 1.2 }}
                    >
                        <input
                            type="date"
                            {...register('donationDate', { required: 'Donation date is required' })}
                            defaultValue={request?.donationDate || ''}
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
                        transition={{ delay: 1.3 }}
                    >
                        <input
                            type="time"
                            {...register('donationTime', { required: 'Donation time is required' })}
                            defaultValue={request?.donationTime || ''}
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
                        transition={{ delay: 1.4 }}
                    >
                        <textarea
                            {...register('requestMessage', { required: 'Request message is required' })}
                            defaultValue={request?.requestMessage || ''}
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
                        transition={{ delay: 1.5 }}
                    >
                        <motion.button
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            type="submit"
                            className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors cursor-pointer"
                        >
                            {loading ? <span className="loading loading-spinner loading-xl"></span> : 'Update Request'}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UpdateDonationRequest;