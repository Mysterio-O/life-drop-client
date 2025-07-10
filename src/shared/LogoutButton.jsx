import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import { FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const LogoutButton = () => {
    const { userLogOut } = useAuth();
    const navigate = useNavigate();

    const handleLogOut = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D32F2F",
            cancelButtonColor: "#4B5563",
            confirmButtonText: "Log Out!",
            cancelButtonText: "Cancel",
            background: "#F9FAFB",
            color: "#111827",
            customClass: {
                popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                content: 'text-[#4B5563] dark:text-[#94A3B8]',
                confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]',
                cancelButton: 'rounded-lg px-4 py-2 text-[#111827] font-semibold bg-[#E5E7EB] hover:bg-[#D1D5DB] transition-all duration-200 dark:text-[#F8FAFC] dark:bg-[#334155] dark:hover:bg-[#475569]'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                userLogOut().then(() => {
                    // console.log('users signed out successful');
                    Swal.fire({
                        title: "Logged Out!",
                        text: "You have been successfully logged out.",
                        icon: "success",
                        background: "#F9FAFB",
                        color: "#111827",
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#D32F2F",
                        customClass: {
                            popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                            title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                            content: 'text-[#4B5563] dark:text-[#94A3B8]',
                            confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]'
                        }
                    });
                    navigate('/')
                }).catch(err => {
                    console.error(err.code, err.message);
                    Swal.fire({
                        title: "Logout Failed",
                        text: "An error occurred while logging out. Please try again.",
                        icon: "error",
                        background: "#F9FAFB",
                        color: "#111827",
                        confirmButtonText: 'OK',
                        confirmButtonColor: "#D32F2F",
                        customClass: {
                            popup: 'text-sm md:text-base lg:text-lg rounded-xl p-4 shadow-lg transition-opacity duration-300',
                            title: 'text-[#111827] font-semibold dark:text-[#F8FAFC]',
                            content: 'text-[#4B5563] dark:text-[#94A3B8]',
                            confirmButton: 'rounded-lg px-4 py-2 text-white font-semibold bg-[#D32F2F] hover:bg-[#B71C1C] transition-all duration-200 dark:bg-[#EF5350] dark:hover:bg-[#F44336]'
                        }
                    });
                })
            }
        });
    }

    return (
        <button
            onClick={handleLogOut}
            className='flex items-center gap-2 mt-10 text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336] font-semibold px-3 py-2 rounded-md hover:bg-[#E5E7EB] dark:hover:bg-[#334155] transition-all duration-200'
        >
            <FaSignOutAlt />
            Logout
        </button>
    );
};

export default LogoutButton;