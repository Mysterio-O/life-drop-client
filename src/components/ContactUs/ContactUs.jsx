import React from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaUser, FaComment } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const ContactUs = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.displayName || '',
            email: user?.email || '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosPublic.post('/contact-messages', data);
            if (res.data.result.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'Thank you for contacting us. We will get back to you soon.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
                reset();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send message. Please try again later.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -150, scale: 0.75 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4 my-10 rounded-xl relative overflow-hidden"
        >
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 bg-[#D32F2F] opacity-5 dark:opacity-10" style={{ zIndex: -1 }}></div> */}

            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="max-w-4xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-lg border border-[#E5E7EB] dark:border-[#334155]"
            >
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#111827] dark:text-[#F8FAFC]"
                >
                    Contact Us
                </motion.h2>
                <motion.p
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-center text-lg text-[#4B5563] dark:text-[#94A3B8] mb-10 max-w-2xl mx-auto"
                >
                    We're here to help with any questions about blood donations, volunteering, or partnerships. Reach out to us anytime!
                </motion.p>
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full md:w-2/3"
                    >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="Your Name"
                                    className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                />
                                {errors.name && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                                <input
                                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } })}
                                    placeholder="Your Email"
                                    className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                />
                                {errors.email && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <FaComment className="absolute left-3 top-4 text-[#4B5563] dark:text-[#94A3B8]" />
                                <textarea
                                    {...register('message', { required: 'Message is required' })}
                                    placeholder="Your Message"
                                    className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                    rows="5"
                                />
                                {errors.message && (
                                    <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full p-3 rounded-md bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                    {/* Enhanced Contact Info */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="w-full md:w-1/3 text-center md:text-left space-y-6"
                    >
                        <h3 className="text-2xl font-semibold text-[#111827] dark:text-[#F8FAFC]">
                            Get in Touch
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-center md:justify-start">
                                <FaPhoneAlt className="text-[#D32F2F] dark:text-[#EF5350] mr-3 text-xl" />
                                <span className="text-lg text-[#111827] dark:text-[#F8FAFC]">
                                    +1-800-LIFEDROP
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <FaEnvelope className="text-[#D32F2F] dark:text-[#EF5350] mr-3 text-xl" />
                                <span className="text-lg text-[#111827] dark:text-[#F8FAFC]">
                                    support@lifedrop.org
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <FaMapMarkerAlt className="text-[#D32F2F] dark:text-[#EF5350] mr-3 text-xl" />
                                <span className="text-lg text-[#111827] dark:text-[#F8FAFC]">
                                    Dhaka, Bangladesh
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-[#4B5563] dark:text-[#94A3B8]">
                            Available 24/7 for urgent blood donation support and inquiries.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 mt-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#D32F2F] dark:text-[#EF5350] hover:scale-110 transition-transform">
                                <FaFacebookF size={24} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#D32F2F] dark:text-[#EF5350] hover:scale-110 transition-transform">
                                <FaTwitter size={24} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#D32F2F] dark:text-[#EF5350] hover:scale-110 transition-transform">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#D32F2F] dark:text-[#EF5350] hover:scale-110 transition-transform">
                                <FaLinkedinIn size={24} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ContactUs;