import React from 'react';
import { Link, NavLink } from 'react-router';
import ThemeSwitch from '../../../shared/ThemeSwitch';
import { FaHeart, FaUser, FaUserMd, FaPlusSquare, FaList } from 'react-icons/fa';
import LogoutButton from '../../../shared/LogoutButton';
import { motion } from 'motion/react';
import useAuth from '../../../hooks/useAuth';
import { Tooltip } from 'react-tooltip';
import logo from "../../../assets/logo-transparent.png"

const Dashboard = ({ closeDashboard }) => {
    const { user } = useAuth();

    const plantPulseVariant = {
        initial: { scale: 1, x: 0 },
        whileHover: { scale: 1.3 },
        whileTap: { scale: 0.9 },
        transition: { duration: 0.3, ease: 'easeInOut' }
    };

    const navItems = [
        { name: 'Overview', icon: <FaHeart />, path: '/dashboard', end: true },
        { name: 'Profile', icon: <FaUser />, path: '/dashboard/profile', end: true },
        { name: 'Create Request', icon: <FaPlusSquare />, path: '/dashboard/create-donation-request', end: true },
        { name: 'My Requests', icon: <FaList />, path: `/dashboard/my-requests`, end: true },
        { name: 'All Request', icon: <FaUserMd />, path: "/dashboard/all-request", end: true }
    ];

    const handleClick = () => {
        closeDashboard();
    };

    return (
        <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='sticky top-0 flex flex-col justify-between pt-16 pb-6 px-4 bg-[#F9FAFB] dark:bg-[#1E293B] shadow-lg rounded-r-lg h-screen'>
            {/* Logo and Theme Toggle */}
            <div>
                <div className='flex items-center justify-around gap-2 mb-8'>
                    <motion.div
                        variants={plantPulseVariant}
                        initial="initial"
                        whileHover="whileHover"
                        whileTap="whileTap"
                        transition="transition"
                        data-tooltip-id='home_tooltip'
                        className='flex items-center justify-center gap-2'
                    >
                        <Tooltip
                            id='home_tooltip'
                            delayShow={300}
                            delayHide={200}
                            place='right'
                            style={{
                                backgroundColor: '#D32F2F',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                textShadow: '0 0 5px rgba(0,0,0,0.7)',
                            }}
                        >
                            Back to home
                        </Tooltip>
                        <Link to="/">
                            <img
                                className='h-12 rounded-full shadow-md border-2 border-[#D32F2F] dark:border-[#EF5350] p-2'
                                src={logo}
                                alt='Logo'
                            />
                        </Link>
                    </motion.div>
                    <ThemeSwitch />
                </div>

                {/* Navigation Links */}
                <nav className='flex flex-col gap-3'>
                    {navItems.map((item, idx) => (
                        <motion.div
                            key={item.name}
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.1, ease: 'easeInOut' }}
                        >
                            <NavLink
                                onClick={handleClick}
                                to={item.path}
                                end={item?.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-3 rounded-md font-medium ${isActive
                                        ? 'bg-[#D32F2F] text-white dark:bg-[#EF5350]'
                                        : 'text-[#111827] hover:bg-[#E5E7EB] dark:text-[#F8FAFC] dark:hover:bg-[#334155]'
                                    }`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        </motion.div>
                    ))}
                </nav>
            </div>

            {/* Logout */}
            <LogoutButton />
        </motion.div>
    );
};

export default Dashboard;