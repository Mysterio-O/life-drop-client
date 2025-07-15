import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    useEffect(()=> {
        document.title = "Privacy Policy"
    },[])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-white dark:bg-[#0F172A] py-16"
        >
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl font-bold text-[#D32F2F] dark:text-[#EF5350] mb-6 text-center"
                >
                    Privacy Policy
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    At LifeDrop, we are committed to protecting your privacy. This Privacy
                    Policy explains how we collect, use, disclose, and safeguard your
                    information when you use our platform.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        Information We Collect
                    </h2>
                    <p>
                        We collect personal information such as your name, email, and
                        contact details when you register or request blood. We also
                        collect usage data to improve our services.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        How We Use Your Information
                    </h2>
                    <p>
                        Your information is used to process donation requests, communicate
                        with you, and enhance platform functionality. We do not share your
                        data with third parties without consent.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-6"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        Your Rights
                    </h2>
                    <p>
                        You have the right to access, correct, or delete your personal
                        information. Contact us at support@livedrop.com for assistance.
                    </p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-[#D32F2F] text-white font-semibold rounded-md hover:bg-[#B71C1C] transition-colors"
                >
                    Back to Home
                </motion.button>
            </div>
        </motion.div>
    );
};

export default PrivacyPolicy;