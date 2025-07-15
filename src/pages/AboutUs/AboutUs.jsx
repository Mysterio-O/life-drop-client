import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

const AboutUs = () => {
    const navigate = useNavigate();

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
                    About Us
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    At LifeDrop, we are dedicated to saving lives through the power of blood
                    donation. Founded with a mission to bridge the gap between donors and
                    those in need, we strive to create a seamless and compassionate platform
                    for urgent blood requests across Bangladesh.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-4"
                >
                    Our vision is to build a community where every drop of blood counts,
                    ensuring timely support for hospitals, patients, and families. With a
                    team of passionate volunteers and advanced technology, we aim to make
                    blood donation accessible to all.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-lg text-[#111827] dark:text-[#F8FAFC] mb-6"
                >
                    <h2 className="text-2xl font-semibold text-[#D32F2F] dark:text-[#EF5350] mb-2">
                        Our Team
                    </h2>
                    <p>
                        Our team consists of healthcare professionals, developers, and
                        community advocates working tirelessly to ensure the success of
                        LifeDrop. Together, we are committed to making a difference, one
                        donation at a time.
                    </p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-[#D32F2F] text-white font-semibold rounded-md hover:bg-[#B71C1C] transition-colors"
                >
                    Back to Home
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AboutUs;