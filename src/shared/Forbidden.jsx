import React from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

const Forbidden = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] p-4"
        >
            <div className="max-w-md w-full text-center bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4 text-[#D32F2F] dark:text-red-400">403 - Forbidden</h1>
                <p className="text-xl mb-6 text-[#111827] dark:text-[#F8FAFC]">
                    Oops! It looks like you don’t have permission to access this page.
                </p>
                <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                    This area is restricted to admins or volunteers only. Please return to the donor section or contact support if you believe this is an error.
                </p>
                <Link
                    to="/"
                    className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                >
                    Back to Home
                </Link>
            </div>
        </motion.div>
    );
};

export default Forbidden;