import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { motion } from 'motion/react';
import axios from 'axios';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Register = () => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const { createUser, setUserProfile } = useAuth();
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const from = location?.state;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

    useEffect(() => {
        fetch('/division.json').then(res => res.json()).then(data => setDivisions(data)).catch(err => console.log('error fetching division data', err));
        fetch('/district.json').then(res => res.json()).then(data => setDistricts(data)).catch(err => console.log('error fetching districts data', err));
        fetch('/upazilas.json').then(res => res.json()).then(data => setUpazilas(data)).catch(err => console.log('error fetching upazilas data', err));
    }, []);

    const filteredDistricts = selectedDivision
        ? districts.filter(d => d.division_id === selectedDivision)
        : [];

    const filteredUpazilas = selectedDistrict
        ? upazilas.filter(u => u.district_id === selectedDistrict)
        : [];

    const onSubmit = async (data) => {
        setLoading(true);
        const division = divisions.find(div => div.id === data.division);
        const district = districts.find(dis => dis.id === data.district);
        const upazila = upazilas.find(up => up.id === data.upazila);
        const { name, email, password, photo } = data;
        const newData = {
            name, email, password, division, district, upazila, photo
        };

        // console.log(newData);
        const image = newData.photo[0];
        console.log(image);
        const formData = new FormData();
        formData.append('image', image);

        const uploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`

        let imageObject = {};

        try {

            const res = await axios.post(uploadURL, formData, {
                'content-type': 'multipart/form-data'
            })
            // console.log('image after upload->', res.data.data);
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

        const userData = {
            name: newData?.name,
            email: newData?.email,
            division: newData?.division?.name,
            district: newData?.district?.name,
            upazila: newData?.upazila?.name,
            created_at: new Date().toISOString(),
            last_log_in: new Date().toISOString()
        }
        // console.log(userData);

        const userObject = {
            displayName: newData?.name,
            photoURL: imageObject?.photoURL
        }

        createUser(email, password)
            .then(result => {
                console.log(result);
                setUserProfile(userObject)
                    .then(async () => {
                        console.log('profile informations updated');

                        const res = await axiosPublic.post('/users', userData);
                        console.log(res.data)
                        if (res.data.insertedId) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Registered Successfully!',
                                text: 'Your LifeDrop account has been created. Redirecting...',
                                timer: 1500,
                                showConfirmButton: false,
                                background: '#F9FAFB', // Light mode surface color
                                customClass: {
                                    title: 'text-[#111827] dark:text-[#F8FAFC]',
                                    text: 'text-[#4B5563] dark:text-[#94A3B8]',
                                    popup: 'dark:bg-[#1E293B]' // Dark mode surface color
                                }
                            });
                            reset()
                            navigate(`${from ? from : '/'}`);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Registration Failed',
                                text: 'Unable to save user data. Please try again.',
                                confirmButtonColor: '#D32F2F', // Light mode error color
                                customClass: {
                                    confirmButton: 'dark:bg-[#EF5350]' // Dark mode error color
                                }
                            });
                        }

                    })
                    .catch(err => {
                        console.log('error updating user informations from update user profile', err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Profile Update Failed',
                            text: 'Unable to update your profile. Please try again.',
                            confirmButtonColor: '#D32F2F', // Light mode error color
                            customClass: {
                                confirmButton: 'dark:bg-[#EF5350]' // Dark mode error color
                            }
                        });
                    })
            })
            .catch(err => {
                console.log('error creating new user with email and password', err);
                Swal.fire({
                    icon: 'error',
                    title: 'User Creation Failed',
                    text: 'Invalid email or password. Please check and try again.',
                    confirmButtonColor: '#D32F2F', // Light mode error color
                    customClass: {
                        confirmButton: 'dark:bg-[#EF5350]' // Dark mode error color
                    }
                });
            });


    };

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
                className="max-w-xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                    Register at LifeDrop
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <input
                            {...register("name", { required: true })}
                            placeholder="Name"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.name && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                Name is required
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <input
                            type="file"
                            {...register("photo", { required: true })}
                            accept="image/*"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#D32F2F] file:text-white file:dark:bg-[#EF5350] hover:file:bg-[#B71C1C] dark:hover:file:bg-[#F44336]"
                        />
                        {errors.photo && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                Photo is required
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <input
                            {...register("email", { required: true })}
                            placeholder="Email"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.email && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                Email is required
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value: passwordRegex,
                                    message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                                },
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
                            })}
                            placeholder="Password"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.password && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <input
                            type="password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: value =>
                                    value === watch('password') || "Passwords do not match"
                            })}
                            placeholder="Confirm Password"
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#4B5563] dark:placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {errors.confirmPassword && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <select
                            {...register("division", { required: true })}
                            onChange={e => setSelectedDivision(e.target.value)}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Division</option>
                            {divisions.map(div => (
                                <option key={div.id} value={div.id}>
                                    {div.name}
                                </option>
                            ))}
                        </select>
                        {errors.division && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                Division is required
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <select
                            {...register("district", { required: true })}
                            onChange={e => setSelectedDistrict(e.target.value)}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select District</option>
                            {filteredDistricts.map(dist => (
                                <option key={dist.id} value={dist.id}>
                                    {dist.name}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                District is required
                            </p>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <select
                            {...register("upazila", { required: true })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map(upz => (
                                <option key={upz.id} value={upz.id}>
                                    {upz.name}
                                </option>
                            ))}
                        </select>
                        {errors.upazila && (
                            <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                Upazila is required
                            </p>
                        )}
                    </motion.div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
                    >
                        Register
                    </motion.button>
                </form>
                <p className="text-sm text-center mt-4 text-[#4B5563] dark:text-[#94A3B8]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336]"
                    >
                        Login
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;