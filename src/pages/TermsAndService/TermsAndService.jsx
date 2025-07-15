import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

const TermsAndService = () => {
    const navigate = useNavigate();
    useEffect(()=> {
        document.title = "Terms & Services"
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
                    Terms and Service
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    Welcome to LifeDrop. By using our platform, you agree to these Terms
                    and Service. Please read them carefully.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        Acceptance of Terms
                    </h2>
                    <p>
                        By accessing LifeDrop, you agree to comply with these terms,
                        including any updates we may make.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        User Responsibilities
                    </h2>
                    <p>
                        You are responsible for the accuracy of donation or request
                        information. Misuse of the platform may result in account
                        suspension.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-6"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        Limitation of Liability
                    </h2>
                    <p>
                        LifeDrop is not liable for delays in blood delivery or health
                        outcomes. Use the service at your own risk.
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

export default TermsAndService;