import React from 'react';
import { Link } from 'react-router';
import bannerImage from '../../assets/banner.png';
import useAuth from '../../hooks/useAuth';
import { motion } from 'motion/react';
import TextType from './TextType';

const Banner = () => {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-[#FFFFFF] dark:from-[#0F172A] via-[#F9FAFB] dark:via-[#1E293B] to-[#E5E7EB] dark:to-[#334155] transition-colors duration-300 py-16 md:py-24 px-4 md:px-12"
        >
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
                {/* Left Content */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 text-center md:text-left space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-[#D32F2F] dark:text-[#EF5350] leading-tight">
                        Find Blood Donors, <br /> <TextType
                            text={["Save Life,", "Give Funds,", "Rebuild Society!"]}
                            typingSpeed={75}
                            pauseDuration={1500}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                    </h1>
                    <p className="text-base md:text-lg text-[#4B5563] dark:text-[#94A3B8]">
                        Connect with donors instantly and join our mission to save lives across Bangladesh.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                        {!user && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/register"
                                    className="btn w-full md:w-auto px-6 py-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-all duration-300"
                                >
                                    Join as a Donor
                                </Link>
                            </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/search-donors"
                                className="btn w-full md:w-auto px-6 py-3 border-2 border-[#D32F2F] dark:border-[#EF5350] text-[#D32F2F] dark:text-[#EF5350] rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] dark:hover:text-white transition-all duration-300"
                            >
                                Search Donors
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex-1 flex justify-center"
                >
                    <img
                        src={bannerImage}
                        alt="Blood donation banner"
                        className="max-w-full md:max-w-[600px] h-auto rounded-lg shadow-lg"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Banner;