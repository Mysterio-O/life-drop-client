import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaHeart, FaHandsHelping } from 'react-icons/fa';
import { useNavigate } from 'react-router';

const FeaturedSection = () => {
    const navigate = useNavigate();
    const [livesSaved, setLivesSaved] = useState(0);

    useEffect(() => {
        const target = 1500;
        let start = 0;
        const duration = 5000;
        const stepTime = Math.abs(Math.floor(duration / target));
        const timer = setInterval(() => {
            start += 1;
            setLivesSaved(start);
            if (start >= target) clearInterval(timer);
        }, stepTime);
        return () => clearInterval(timer);
    }, []);

    const handleFundingClick = () => {
        navigate('/give-funding');
    };

    const handleRequestClick = () => {
        navigate('/dashboard/create-donation-request');
    };

    return (
        <motion.section
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="py-2 bg-white dark:bg-[#0F172A]  overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-0 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className=" bg-white dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    {/* Text and Stats Column */}
                    <div className="text-center md:text-left space-y-6 flex-1">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-[#F8FAFC]"
                        >
                            Welcome to LifeDrop
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl"
                        >
                            Saving lives, one drop at a time. Join our mission to provide
                            urgent blood donations across Bangladesh.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="flex justify-center md:justify-start items-center gap-4"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-[#D32F2F]"
                            >
                                <FaHeart className="text-3xl" />
                            </motion.div>
                            <span className="text-3xl font-semibold text-[#D32F2F] dark:text-[#EF5350]">
                                {livesSaved}+
                            </span>
                            <span className="text-lg text-gray-600 dark:text-gray-300">
                                Lives Saved
                            </span>
                        </motion.div>
                    </div>

                    {/* Buttons Column */}
                    <div className="flex-1 space-x-4 text-center md:text-right space-y-4">
                        <motion.button
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            onClick={handleFundingClick}
                            className="px-6 py-3 bg-[#D32F2F] text-white font-semibold rounded-md hover:bg-[#B71C1C] transition-colors w-full md:w-auto cursor-pointer"
                        >
                            <div className='flex gap-3 items-center'>
                                <span>Give Funding</span>
                                <span>
                                    <FaHandsHelping size={24}/>
                                </span>
                            </div>
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            onClick={handleRequestClick}
                            className="px-6 py-3 border-2 border-[#D32F2F] text-[#D32F2F] font-semibold rounded-md hover:bg-[#D32F2F] hover:text-white transition-colors w-full md:w-auto mt-4 md:mt-0 cursor-pointer"
                        >
                            Request Blood
                        </motion.button>
                    </div>
                </motion.div>
            </div>
            {/* <div
                className="absolute inset-0 bg-[#D32F2F] opacity-5 dark:opacity-10"
                style={{ zIndex: -1 }}
            ></div> */}
        </motion.section>
    );
};

export default FeaturedSection;