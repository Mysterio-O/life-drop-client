import React, { useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { GoQuestion } from 'react-icons/go';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { AnimatePresence, motion } from 'motion/react';
import LogoutButton from '../../../shared/LogoutButton';
import { PiUserSwitchLight } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Body from './Body';
import { Tooltip } from 'react-tooltip';
import { getAccountsFromLocalStorage } from '../../../hooks/getAccountsFromLocalStorage';
import ProfileBox from './ProfileBox';
import useAuth from '../../../hooks/useAuth';

const DashboardUser = ({ handleUserDashClose }) => {
    const { user, userLogOut, loginUser } = useAuth();
    // console.log(user);

    const navigate = useNavigate();

    const [isArrowOpen, setIsArrowOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [savedAcc, setSavedAcc] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const arrowVariant = {
        initial: { y: -20, opacity: 0, scale: 0.7 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: { y: -20, opacity: 0, scale: 0.7 },
        transition: { duration: 0.3, ease: 'easeInOut' }
    };

    const modalVariant = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0.3, ease: 'easeInOut' },
    };

    const handleSwitch = () => {
        setIsModalOpen(true);
        const savedAccounts = getAccountsFromLocalStorage();
        const accounts = savedAccounts.filter(acc => acc?.email !== user?.email);
        setSavedAcc(accounts);
        setSelectedAccount(null);
        setPassword('');
        setPasswordError('');
    };
    const handleCancelSwitch = () => {
        setIsModalOpen(false);
        setSelectedAccount(null);
        setPassword('');
        setPasswordError('');
    };
    const handleSelectAccount = (acc) => {
        setSelectedAccount(acc);
        setPassword('');
        setPasswordError('');
    };
    const handleConfirmSwitch = async () => {
        if (!selectedAccount) {
            Swal.fire({
                title: 'No Account Selected',
                text: 'Please select an account to switch to.',
                icon: 'warning',
                background: '#F9FAFB',
                color: '#111827',
                confirmButtonColor: '#D32F2F',
                customClass: {
                    popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                    title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                    content: 'text-[#4B5563] dark:text-[#94A3B8]',
                    confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]'
                }
            });
            return;
        }

        if (selectedAccount?.provider === 'password' && !password) {
            setPasswordError('Please enter a password.');
            return;
        }

        Swal.fire({
            title: 'Switching Account...',
            text: 'Please wait while we process your request.',
            icon: 'info',
            showConfirmButton: false,
            background: '#F9FAFB',
            color: '#111827',
            timer: 1500,
            customClass: {
                popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                content: 'text-[#4B5563] dark:text-[#94A3B8]'
            }
        });

        try {
            await userLogOut();

            if (!password) {
                setPasswordError('Please enter a password.');
                Swal.close();
                return;
            }
            await loginUser(selectedAccount?.email, password);

            Swal.fire({
                title: 'Account Switched!',
                text: 'You have successfully switched accounts.',
                icon: 'success',
                background: '#F9FAFB',
                color: '#111827',
                confirmButtonColor: '#D32F2F',
                customClass: {
                    popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                    title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                    content: 'text-[#4B5563] dark:text-[#94A3B8]',
                    confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]'
                }
            });
            setIsModalOpen(false);
            setSelectedAccount(null);
            setPassword('');
            navigate('/dashboard');
        } catch (err) {
            console.error('Switch account failed:', err);
            setPasswordError('Invalid password. Please try again.');
            Swal.fire({
                title: 'Switch Failed',
                text: 'Invalid password or an error occurred. Please try again.',
                icon: 'error',
                background: '#F9FAFB',
                color: '#111827',
                confirmButtonColor: '#D32F2F',
                customClass: {
                    popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                    title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                    content: 'text-[#4B5563] dark:text-[#94A3B8]',
                    confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]'
                }
            });
        }
    };

    return (
        <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='sticky top-0 min-h-screen pt-16 pr-4 bg-[#F9FAFB] dark:bg-[#1E293B]'>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            variants={modalVariant}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            className='bg-[#F9FAFB] dark:bg-[#1E293B] rounded-xl p-6 w-full max-w-md text-[#111827] dark:text-[#F8FAFC] shadow-lg'
                        >
                            <h2 className='text-2xl font-semibold mb-4 text-center'>Switch Account</h2>
                            <p className='text-center mb-6 text-[#4B5563] dark:text-[#94A3B8]'>Select an account to switch to:</p>

                            <div className='max-h-64 overflow-y-auto space-y-4'>
                                {savedAcc.length > 0 ? (
                                    savedAcc.map((acc, idx) => (
                                        <ProfileBox
                                            key={idx}
                                            acc={acc}
                                            isSelected={selectedAccount?.email === acc.email}
                                            handleSelectAccount={handleSelectAccount}
                                        />
                                    ))
                                ) : (
                                    <p className='text-center text-[#4B5563] dark:text-[#94A3B8]'>No other accounts available.</p>
                                )}
                            </div>

                            {selectedAccount?.provider === 'password' && (
                                <div className='mt-4'>
                                    <label className='block text-sm font-medium mb-1 text-[#111827] dark:text-[#F8FAFC]'>Password for {selectedAccount.email}</label>
                                    <input
                                        type='password'
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        className='w-full p-2 rounded bg-[#E5E7EB] dark:bg-[#334155] text-[#111827] dark:text-[#F8FAFC]'
                                        placeholder='Enter password'
                                    />
                                    {passwordError && (
                                        <p className='text-[#D32F2F] dark:text-[#EF5350] text-sm mt-1'>{passwordError}</p>
                                    )}
                                </div>
                            )}

                            <div className='flex justify-center gap-4 mt-6'>
                                {selectedAccount && (
                                    <button
                                        onClick={handleConfirmSwitch}
                                        className='px-4 py-2 bg-[#D32F2F] dark:bg-[#EF5350] rounded-lg text-white font-semibold hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-all duration-200'
                                    >
                                        Switch Account
                                    </button>
                                )}
                                <button
                                    onClick={handleCancelSwitch}
                                    className='px-4 py-2 bg-[#E5E7EB] dark:bg-[#334155] rounded-lg text-[#111827] dark:text-[#F8FAFC] font-semibold hover:bg-[#D1D5DB] dark:hover:bg-[#475569] transition-all duration-200'
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* setting icon and account toggle */}
            <div className='flex gap-6 items-center justify-end relative'>
                {/* info tooltip box */}
                <div
                    data-tooltip-id="info_tip"
                    data-tooltip-content={`${user?.displayName ? user.displayName : user?.email}'s Dashboard`}
                    data-tooltip-place="top"
                >
                    <motion.span
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.3 }}
                    >
                        <GoQuestion size={24} className='text-[#111827] dark:text-[#F8FAFC] hover:text-[#4B5563] dark:hover:text-[#94A3B8] transition-colors duration-200' />
                    </motion.span>
                    <Tooltip
                        id="info_tip"
                        delayShow={100}
                        delayHide={200}
                        style={{
                            backgroundColor: '#4B5563',
                            color: '#F8FAFC',
                            fontWeight: 800,
                            textShadow: '0 0 5px rgba(0,0,0,0.7)',
                        }}
                    />
                </div>

                {/* setting tooltip box */}
                <div
                    data-tooltip-id="setting_tip"
                    data-tooltip-content="Setting"
                    data-tooltip-place="top"
                >
                    <Link to="/dashboard/setting">
                        <motion.span
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.5 }}
                            onClick={handleUserDashClose} className='cursor-pointer text-[#111827] dark:text-[#F8FAFC] hover:text-[#4B5563] dark:hover:text-[#94A3B8] transition-colors duration-200'>
                            <CiSettings size={30} />
                        </motion.span>
                    </Link>
                    <Tooltip
                        id="setting_tip"
                        delayShow={100}
                        delayHide={200}
                        style={{
                            backgroundColor: '#4B5563',
                            color: '#F8FAFC',
                            fontWeight: 800,
                            textShadow: '0 0 5px rgba(0,0,0,0.7)',
                        }}
                    />
                </div>

                <div className='flex items-center justify-center gap-3'>
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.7 }}
                        className='p-1 rounded-full border-2 border-[#D32F2F] dark:border-[#EF5350]'>
                        <img
                            className='w-8 h-8 rounded-full'
                            src={user?.photoURL}
                            alt={`${user?.displayName ? user.displayName : user.email}'s photo`}
                        />
                    </motion.div>
                    <motion.span
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeInOut', delay: 1 }}
                        onClick={() => setIsArrowOpen(!isArrowOpen)}
                        className={`cursor-pointer transition-transform duration-300 transform ${isArrowOpen ? '-rotate-360' : 'rotate-0'} text-[#111827] dark:text-[#F8FAFC] hover:text-[#4B5563] dark:hover:text-[#94A3B8]`}
                    >
                        {isArrowOpen ? <IoIosArrowUp size={30} /> : <IoIosArrowDown size={30} />}
                    </motion.span>

                    <AnimatePresence>
                        {isArrowOpen && (
                            <motion.div
                                className='absolute right-0 top-full mt-2 w-[350px] z-10 bg-[#F9FAFB] dark:bg-[#1E293B] py-6 space-y-2 shadow-lg rounded-lg'
                                variants={arrowVariant}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition="transition"
                            >
                                {user?.displayName ? (
                                    <p className='text-2xl font-extrabold text-center text-[#111827] dark:text-[#F8FAFC]'>{user.email}</p>
                                ) : (
                                    <p className='text-2xl font-extrabold text-center text-[#111827] dark:text-[#F8FAFC]'>{user.email}</p>
                                )}

                                <div className='flex items-center justify-center'>
                                    <motion.p
                                        onClick={handleSwitch}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className='flex items-center justify-center gap-2 text-xl font-medium cursor-pointer text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336]'
                                    >
                                        <span><PiUserSwitchLight size={30} /></span>
                                        Switch Account
                                    </motion.p>
                                </div>

                                <div className='flex justify-center items-center'>
                                    <LogoutButton />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className='mt-10 flex justify-center items-center'>
                <Body />
            </div>
        </motion.div>
    );
};

export default DashboardUser;