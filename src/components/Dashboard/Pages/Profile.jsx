import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query'
import { MdEdit, MdEditOff } from 'react-icons/md';
import Swal from 'sweetalert2';
import axios from 'axios';
import Tippy from '@tippyjs/react';

const Profile = () => {

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    const { user, setUserProfile } = useAuth();
    const { displayName, email } = user;

    const axiosSecure = useAxiosSecure();

    const { data: selectedUser = {}, isLoading, isError, refetch } = useQuery({
        queryKey: ['user', user.email],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user?email=${email}`);
            return res.data;
        }
    });


    // console.log(selectedUser);
    const { blood_group, district, division, upazila } = selectedUser;
    // console.log(district,division,upazila);




    const filteredDistricts = selectedDivision
        ? districts.filter(d => d.division_id === selectedDivision)
        : [];

    const filteredUpazilas = selectedDistrict
        ? upazilas.filter(u => u.district_id === selectedDistrict)
        : [];

    useEffect(() => {
        fetch('/division.json').then(res => res.json()).then(data => setDivisions(data)).catch(err => console.log('error fetching division data', err));
        fetch('/district.json').then(res => res.json()).then(data => setDistricts(data)).catch(err => console.log('error fetching districts data', err));
        fetch('/upazilas.json').then(res => res.json()).then(data => setUpazilas(data)).catch(err => console.log('error fetching upazilas data', err));

        document.title = 'My Profile';

    }, []);

    useEffect(() => {
        if (selectedUser && divisions.length && districts.length && upazilas.length) {
            // Map division name to ID
            const div = divisions.find(d => d.name === division);
            setSelectedDivision(div ? div.id : '');
            // Map district name to ID
            const dist = districts.find(d => d.name === district);
            setSelectedDistrict(dist ? dist.id : '');
            // Map upazila name to ID
            const upz = upazilas.find(u => u.name === upazila);
            setSelectedUpazila(upz ? upz.id : '');
            reset({
                bloodGroup: blood_group || '',
                division: div ? div.id : '',
                district: dist ? dist.id : '',
                upazila: upz ? upz.id : ''
            });
        }
    }, [selectedUser, reset, blood_group, division, district, upazila, divisions, districts, upazilas]);

    // console.log(selectedDistrict, selectedUpazila)

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4 overflow-hidden">
                <div className="max-w-xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto" />
                    <div className="absolute top-2 right-2">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="flex justify-center">
                        <div className="h-20 w-20 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                    <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded w-full mt-4" />
                </div>
            </div>
        );
    }


    if (isError) {
        <div className='min-h-screen flex justify-center items-center'>
            <p className="text-2xl text-red-500">Failed to load user info!</p>
        </div>
    }


    const onSubmit = async (data) => {
        // console.log(data);
        setLoading(true)

        const updatedData = {};
        const updateFB = {};

        if (data.name && data.name !== selectedUser.name) {
            updatedData.name = data.name;
            updateFB.displayName = data.name
        }
        if (data.bloodGroup && data.bloodGroup !== selectedUser.blood_group) updatedData.blood_group = data.bloodGroup;

        const { photo } = data;
        console.log(photo.length);
        // console.log(photo);
        const formData = new FormData();
        let imageObject = {};
        if (photo.length === 1) {
            const image = photo[0];
            // console.log(image);
            formData.append('image', image);
            // console.log(formData);

            const uploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;



            try {

                const res = await axios.post(uploadURL, formData, {
                    'content-type': 'multipart/form-data'
                })
                console.log('image after upload->', res.data.data);
                imageObject = {
                    delete_url: res?.data?.data?.delete_url,
                    photoURL: res?.data?.data?.url
                }
                console.log(imageObject)
            }
            catch (error) {
                console.log('error uploading image', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Image Upload Failed',
                    text: 'Unable to upload your photo. Please try again.',
                    confirmButtonColor: '#D32F2F', // Light mode error color
                    customClass: {
                        confirmButton: 'dark:bg-[#EF5350]' // Dark mode error color
                    }
                });
                setLoading(false)
                return; // Stop execution if image upload fails
            }
        }

        const selectedDiv = divisions.find(d => d.id === data.division)?.name;
        const selectedDist = districts.find(d => d.id === data.district)?.name;
        const selectedUpz = upazilas.find(u => u.id === data.upazila)?.name;

        if (selectedDiv && selectedDiv !== selectedUser.division) updatedData.division = selectedDiv;
        if (selectedDist && selectedDist !== selectedUser.district) updatedData.district = selectedDist;
        if (selectedUpz && selectedUpz !== selectedUser.upazila) updatedData.upazila = selectedUpz;
        if (imageObject) {
            const { photoURL, delete_url } = imageObject
            updatedData.photoURL = photoURL;
            updatedData.delete_url = delete_url;

            // update photoURL in the firebase
            updateFB.photoURL = photoURL
        }

        if (Object.keys(updatedData).length === 0) {
            setLoading(false);
            Swal.fire({
                icon: 'info',
                title: 'No Changes',
                text: 'No updates were detected in your profile.',
                confirmButtonColor: '#111827',
                customClass: {
                    confirmButton: 'dark:bg-[#F8FAFC]'
                }
            });
            return;
        }
        console.log(updatedData);
        console.log(updateFB);

        if (updateFB) {
            setUserProfile(updateFB)
                .then(() => {
                    console.log('user info updated successfully in the firebase');
                })
                .catch(err => {
                    console.error('error updating user info in the firebase', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Firebase Update Failed',
                        text: 'There was an issue updating your profile in Firebase. Please try again.',
                        confirmButtonColor: '#D32F2F',
                        customClass: {
                            confirmButton: 'dark:bg-[#EF5350]'
                        }
                    });
                })
        }

        try {
            const res = await axiosSecure.patch(`/user/update/${selectedUser._id}`, updatedData);
            setLoading(false);
            setEdit(false);
            console.log(res.data);
            if (res.data.result.modifiedCount === 1) {
                refetch();
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated',
                    text: 'Your profile has been successfully updated!',
                    confirmButtonColor: '#111827',
                    customClass: {
                        confirmButton: 'dark:bg-[#F8FAFC]'
                    }
                });
                console.log('user info updated');
            }
        }
        catch (error) {
            setLoading(false);
            console.log('error patching user profile', error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'There was an issue updating your profile. Please try again.',
                confirmButtonColor: '#D32F2F',
                customClass: {
                    confirmButton: 'dark:bg-[#EF5350]'
                }
            });
        }


    }



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4 overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md relative"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                    Update you BloodDrop Profile
                </h2>

                <Tippy content={`${edit ? 'Close' : 'Update your profile'}`} placement="top">
                    <motion.span
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setEdit(!edit)}
                        className='absolute top-2 right-2 text-[#111827] dark:text-[#F8FAFC] cursor-pointer transition-colors duration-300 z-20'
                    >
                        {!edit ? <MdEdit size={30} /> : <MdEditOff size={30} />}
                    </motion.span>
                </Tippy>


                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <input
                            {...register("name")}
                            defaultValue={displayName}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                        />
                    </motion.div>

                    <AnimatePresence>
                        {
                            !edit && <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.75, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className='flex justify-center items-center'>
                                <img src={user.photoURL} alt="" className='size-20 rounded-full' />
                            </motion.div>
                        }
                    </AnimatePresence>

                    <AnimatePresence>
                        {
                            edit && <motion.div
                                initial={{ x: -10, scale: 0.85, opacity: 0 }}
                                animate={{ x: 0, scale: 1, opacity: 1 }}
                                exit={{ x: -10, scale: 0.7, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <input
                                    type="file"
                                    {...register("photo")}
                                    accept="image/*"
                                    disabled={!edit}
                                    className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#D32F2F] file:text-white file:dark:bg-[#EF5350] hover:file:bg-[#B71C1C] dark:hover:file:bg-[#F44336] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                                />
                            </motion.div>
                        }
                    </AnimatePresence>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            {...register("email")}
                            value={email}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <select
                            {...register("bloodGroup")}
                            defaultValue={blood_group || ''}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
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
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <select
                            {...register("division")}
                            onChange={e => setSelectedDivision(e.target.value)}
                            defaultValue={selectedDivision}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                        >
                            {divisions.map(div => (
                                <option key={div.id} value={div.id}>
                                    {div.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <select
                            {...register("district")}
                            onChange={e => setSelectedDistrict(e.target.value)}
                            defaultValue={selectedDistrict}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                        >
                            {filteredDistricts.map(dist => (
                                <option key={dist.id} value={dist.id}>
                                    {dist.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <select
                            {...register("upazila")}
                            defaultValue={selectedUpazila || ''}
                            disabled={!edit}
                            className={`w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] ${!edit ? 'border-0 cursor-not-allowed' : ''}`}
                        >
                            {filteredUpazilas.map(upz => (
                                <option key={upz.id} value={upz.id}>
                                    {upz.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>
                    <AnimatePresence>
                        {
                            edit && <motion.button
                                type="submit"
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                exit={{ scale: 0.85, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                disabled={loading}
                                className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
                            >
                                {
                                    !loading ? "Update" : <span className="loading loading-spinner loading-xl"></span>
                                }
                            </motion.button>
                        }
                    </AnimatePresence>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Profile;