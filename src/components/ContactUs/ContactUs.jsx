import React from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { FaPhoneAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const ContactUs = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.displayName || '',
            email: user?.email || '',
        },
    });

    const onSubmit = async (data) => {
        // console.log(data);

        try {
            const res = await axiosPublic.post('/contact-messages', data);
            if (res.data.result.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'Thank you for contacting us.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
                reset();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send message. Please try again.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y:-150, scale:0.75 }}
            whileInView={{ opacity: 1, y:0,scale:1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-red-600/10 dark:bg-[#0F172A] p-4 my-10 rounded-xl"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="max-w-2xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                    Contact Us
                </h2>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full md:w-2/3"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="Your Name"
                                    className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                />
                                {errors.name && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
                                    placeholder="Your Email"
                                    className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                />
                                {errors.email && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.email.message || 'Invalid email format'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <textarea
                                    {...register('message', { required: 'Message is required' })}
                                    placeholder="Your Message"
                                    className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                    rows="4"
                                />
                                {errors.message && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                    {/* Contact Number */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-1/3 text-center md:text-left"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-[#111827] dark:text-[#F8FAFC]">
                            Get in Touch
                        </h3>
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <FaPhoneAlt className="text-[#D32F2F] dark:text-[#EF5350] mr-2" />
                            <span className="text-lg text-[#111827] dark:text-[#F8FAFC]">
                                +1-800-LIFEDROP
                            </span>
                        </div>
                        <p className="text-sm text-[#4B5563] dark:text-[#94A3B8]">
                            Available 24/7 for your support needs.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactUs;