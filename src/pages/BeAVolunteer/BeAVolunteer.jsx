import React from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaComment, FaBriefcase, FaHeartbeat, FaClock, FaUserShield, FaCalendar, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BeAVolunteer = () => {
const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const { role, role_loading } = useUserRole();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // TanStack Query mutation for submitting volunteer application
    const { mutate, isPending } = useMutation({
        mutationKey: ['volunteer-application'],
        mutationFn: async (data) => {
            const response = await axiosSecure.post('/volunteer-applications', data);
            console.log(response);
            return response.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Application Submitted!',
                text: 'Thank you for applying to volunteer with LifeDrop. Our team will review your application and get back to you soon.',
                confirmButtonColor: '#111827',
                customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
            });
            reset();
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit application. Please try again later.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        },
    });

    const onSubmit = (data) => {
        mutate(data);
    };

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full mx-auto bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155]"
        >
            <div className="animate-pulse space-y-6">
                {/* Heading Skeleton */}
                <div className="h-10 bg-[#E5E7EB] dark:bg-[#334155] rounded w-3/4 mx-auto"></div>
                {/* Subtitle Skeleton */}
                <div className="h-6 bg-[#E5E7EB] dark:bg-[#334155] rounded w-5/6 mx-auto"></div>
                {/* Input Skeletons */}
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="h-12 bg-[#E5E7EB] dark:bg-[#334155] rounded w-full"></div>
                ))}
                {/* Textarea Skeletons */}
                <div className="h-20 bg-[#E5E7EB] dark:bg-[#334155] rounded w-full"></div>
                <div className="h-32 bg-[#E5E7EB] dark:bg-[#334155] rounded w-full"></div>
                {/* Button Skeleton */}
                <div className="h-12 bg-[#D32F2F] dark:bg-[#EF5350] rounded w-full"></div>
            </div>
        </motion.div>
    );

    // Role Message Component
    const RoleMessage = ({ message, icon: Icon, redirectPath }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl w-full mx-auto bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155] text-center"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[#D32F2F] dark:text-[#EF5350] mb-4"
            >
                <Icon className="text-5xl mx-auto" />
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-[#F8FAFC] mb-4"
            >
                {message}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg text-[#4B5563] dark:text-[#94A3B8] mb-6"
            >
                {message === "You cannot apply for volunteer while you are an admin."
                    ? "As an admin, you already have full access to manage volunteer activities."
                    : "You are already contributing to our mission as a volunteer!"}
            </motion.p>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => navigate(redirectPath)}
                className="px-6 py-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white font-semibold rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
            >
                Go to {redirectPath === '/' ? 'Homepage' : 'Dashboard'}
            </motion.button>
        </motion.div>
    );

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8"
        >
            {(!user || loading || role_loading) ? (
                <SkeletonLoader />
            ) : role === 'admin' ? (
                <RoleMessage
                    message="You cannot apply for volunteer while you are an admin."
                    icon={FaUserShield}
                    redirectPath="/dashboard"
                />
            ) : role === 'volunteer' ? (
                <RoleMessage
                    message="You are already a volunteer."
                    icon={FaUserPlus}
                    redirectPath="/dashboard"
                />
            ) : (
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-2xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155]"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-center text-[#111827] dark:text-[#F8FAFC] mb-6"
                    >
                        Become a LifeDrop Volunteer
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center text-lg text-[#4B5563] dark:text-[#94A3B8] mb-8 max-w-xl mx-auto"
                    >
                        Join our mission to save lives by coordinating blood donations and supporting our community. Fill out the form below to apply.
                    </motion.p>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Full Name */}
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('name', { required: 'Full name is required' })}
                                placeholder="Your Full Name"
                                defaultValue={user?.displayName || ''}
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.name && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                                placeholder="Your Email"
                                defaultValue={user?.email || ''}
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending || user?.email}
                            />
                            {errors.email && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('phone', {
                                    required: 'Phone number is required',
                                    pattern: {
                                        value: /^\+?[1-9]\d{1,14}$/,
                                        message: 'Invalid phone number format (e.g., +8801234567890)',
                                    },
                                })}
                                placeholder="Your Phone Number (e.g., +8801234567890)"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.phone && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="relative">
                            <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                type="date"
                                {...register('dob', {
                                    required: 'Date of birth is required',
                                    validate: {
                                        isAdult: (value) => {
                                            const today = new Date();
                                            const birthDate = new Date(value);
                                            const age = today.getFullYear() - birthDate.getFullYear();
                                            const monthDiff = today.getMonth() - birthDate.getMonth();
                                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                return age - 1 >= 18 || 'You must be at least 18 years old';
                                            }
                                            return age >= 18 || 'You must be at least 18 years old';
                                        },
                                    },
                                })}
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.dob && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.dob.message}
                                </p>
                            )}
                        </div>

                        {/* Occupation */}
                        <div className="relative">
                            <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('occupation', { required: 'Occupation is required' })}
                                placeholder="Your Occupation"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.occupation && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.occupation.message}
                                </p>
                            )}
                        </div>

                        {/* Blood Group */}
                        <div className="relative">
                            <FaHeartbeat className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <select
                                {...register('bloodGroup', { required: 'Blood group is required' })}
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            >
                                <option value="" disabled selected>Select your blood group</option>
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
                        </div>

                        {/* Availability */}
                        <div className="relative">
                            <FaClock className="absolute left-3 top-4 text-[#4B5563] dark:text-[#94A3B8]" />
                            <textarea
                                {...register('availability', { required: 'Availability is required' })}
                                placeholder="Describe your availability (e.g., days, times you can volunteer)"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                rows="3"
                                disabled={isPending}
                            />
                            {errors.availability && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.availability.message}
                                </p>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <div className="relative">
                            <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('emergencyContact', {
                                    required: 'Emergency contact is required',
                                    pattern: {
                                        value: /^\+?[1-9]\d{1,14}$/,
                                        message: 'Invalid emergency contact number format (e.g., +8801234567890)',
                                    },
                                })}
                                placeholder="Emergency Contact Number (e.g., +8801234567890)"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.emergencyContact && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.emergencyContact.message}
                                </p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-4 text-[#4B5563] dark:text-[#94A3B8]" />
                            <textarea
                                {...register('address', { required: 'Address is required' })}
                                placeholder="Your Address"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                rows="3"
                                disabled={isPending}
                            />
                            {errors.address && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.address.message}
                                </p>
                            )}
                        </div>

                        {/* Motivation Statement */}
                        <div className="relative">
                            <FaComment className="absolute left-3 top-4 text-[#4B5563] dark:text-[#94A3B8]" />
                            <textarea
                                {...register('motivation', {
                                    required: 'Motivation statement is required',
                                    minLength: {
                                        value: 50,
                                        message: 'Motivation statement must be at least 50 characters',
                                    },
                                })}
                                placeholder="Why do you want to volunteer with LifeDrop?"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                rows="5"
                                disabled={isPending}
                            />
                            {errors.motivation && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                    {errors.motivation.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white font-semibold hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isPending}
                        >
                            {isPending ? 'Submitting...' : 'Submit Application'}
                        </motion.button>
                    </motion.form>
                </motion.div>
            )}
        </motion.section>
    );
};

export default BeAVolunteer;