import React from 'react';
import { motion } from 'motion/react';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';

const VolunteerSection = () => {
    const navigate = useNavigate();
    const {user}=useAuth()

    const handleVolunteerClick = () => {
        if(!user){
            Swal.fire({
                title:"SignIn Required!",
                icon:'warning',
                text:"Sign In to submit an application.",
                confirmButtonText:"Go to sign in",
                showCancelButton: true,
                cancelButtonText:"Cancel",
                cancelButtonColor:'red',
                confirmButtonColor:'green'
            })
            .then((result)=> {
                if(result.isConfirmed){
                    navigate('/be-a-volunteer');
                }
            })
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, x: "-20%" }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="py-2 bg-white dark:bg-[#0F172A] overflow-hidden"
        >
            <div className="container mx-auto px-4 md:px-0 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    {/* Text and Icon Column */}
                    <div className="text-center md:text-left space-y-6 flex-1">
                        <motion.h1
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-[#F8FAFC]"
                        >
                            Join as a Volunteer
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl"
                        >
                            Make a difference by helping coordinate blood donations and support our community efforts across Bangladesh.
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
                                className="text-[#D32F2F] dark:text-[#EF5350]"
                            >
                                <FaUserPlus className="text-3xl" />
                            </motion.div>
                            <span className="text-lg text-gray-600 dark:text-gray-300">
                                Become Part of the Team
                            </span>
                        </motion.div>
                    </div>

                    {/* Button Column */}
                    <div className="flex-1 space-x-4 text-center md:text-right space-y-4">
                        <motion.button
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 1 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            onClick={handleVolunteerClick}
                            className="px-6 py-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white font-semibold rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors w-full md:w-auto cursor-pointer"
                        >
                            <div className='flex gap-3 items-center'>
                                <span>Be a Volunteer</span>
                                <span>
                                    <FaUserPlus size={24}/>
                                </span>
                            </div>
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

export default VolunteerSection;