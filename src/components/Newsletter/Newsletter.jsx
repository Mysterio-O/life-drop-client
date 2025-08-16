import React from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { FaEnvelope } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import emailjs from '@emailjs/browser';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Newsletter = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();

    // TanStack Query mutation for subscribing to newsletter
    const { mutate, isPending } = useMutation({
        mutationFn: async (email) => {
            const response = await axiosPublic.post('/newsletter-subscriptions', { email });
            return response.data;
        },
        onSuccess: (data, variables) => {
            Swal.fire({
                icon: 'success',
                title: 'Subscribed!',
                text: 'We"ve sent you welcome email. If not found, check the spam.',
                confirmButtonColor: '#111827',
                customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
            });
            reset();
            console.log(variables);

            /**
             * sending welcome email with email js
             */
            const templateParams = {
                email: variables
            };

            const env = import.meta.env;

            emailjs.send(
                env.VITE_EMAILJS_SERVICE_ID,
                env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams,
                env.VITE_EMAILJS_PUBLIC_KEY
            )
                .then((res) => {
                    console.log("welcome email sent successfully", res);
                })
                .catch((err) => {
                    console.error("error sending welcome message", err);
                })

        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to subscribe. Please try again later.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        },
    });

    const onSubmit = (data) => {
        mutate(data.email);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-12 bg-white dark:bg-[#0F172A] overflow-hidden mb-10"
        >
            <div className="container mx-auto px-4 md:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155] text-center"
                >
                    <motion.h2
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-[#111827] dark:text-[#F8FAFC] mb-4"
                    >
                        Join Our Newsletter
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-lg text-[#4B5563] dark:text-[#94A3B8] mb-8 max-w-2xl mx-auto"
                    >
                        Stay updated with LifeDrop’s latest news, blood donation drives, and community impact stories.
                    </motion.p>
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col md:flex-row gap-4 justify-center items-center"
                    >
                        <div className="relative w-full md:w-2/3">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4B5563] dark:text-[#94A3B8]" />
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                                placeholder="Enter your email"
                                className="w-full pl-10 p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                disabled={isPending}
                            />
                            {errors.email && (
                                <p className="text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1 text-left">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 py-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white font-semibold rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isPending}
                        >
                            {isPending ? 'Subscribing...' : 'Subscribe'}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default Newsletter;