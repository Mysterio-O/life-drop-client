import React from 'react';
import { motion } from 'motion/react';
import { FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const ErrorPage = () => {

    const navigate = useNavigate();

    if (window.location.pathname === '/') {
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

    return (
        <motion.div
            initial={{ opacity: 0, backgroundColor: '#FFFFFF' }}
            animate={{ opacity: 1, backgroundColor: '#FFFFFF' }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A] p-4 overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-md w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-xl shadow-lg relative"
                style={{
                    boxShadow: '0 0 15px rgba(211, 47, 47, 0.3)',
                }}
            >
                {/* Glowing Error Code */}
                <motion.h1
                    className="text-6xl font-bold text-[#D32F2F] dark:text-[#EF5350] text-center mb-4"
                    initial={{ scale: 1 }}
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            '0 0 0px rgba(211, 47, 47, 0.7)',
                            '0 0 10px rgba(211, 47, 47, 0.7)',
                            '0 0 0px rgba(211, 47, 47, 0.7)',
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                    }}
                >
                    404
                </motion.h1>

                {/* Error Icon */}
                <div className="flex justify-center mb-6">
                    <FaExclamationCircle className="text-5xl text-[#D32F2F] dark:text-[#EF5350]" />
                </div>

                {/* Error Message */}
                <p className="text-lg text-[#111827] dark:text-[#F8FAFC] text-center mb-6">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <motion.a
                        href="/"
                        className="px-6 py-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors duration-300"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        Go Back Home
                    </motion.a>
                    <motion.a
                        href="#contact-us"
                        className="px-6 py-3 bg-transparent border border-[#D32F2F] dark:border-[#EF5350] text-[#D32F2F] dark:text-[#EF5350] rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] dark:hover:text-white transition-colors duration-300"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        Contact Support
                    </motion.a>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ErrorPage;