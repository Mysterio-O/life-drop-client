import React from 'react';
import { FaRegCircleUser } from 'react-icons/fa6';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Setting = () => {
    const { user, loading, deleteUserFirebase } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();


    const { mutate: deleteUser, isPending } = useMutation({
        mutationKey: ['delete user', user],
        mutationFn: async ({ email }) => {
            const res = await axiosSecure.delete(`/user-delete/${email}`);
            return res.data.result
        },
        onSuccess: (data) => {
            if (data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Your account has been deleted. (Simulated)', 'success');
            }
        }
    })


    const handleDelete = (user) => {

        const email = user.email

        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete your account and all associated data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            customClass: {
                popup: 'dark:bg-[#0F172A] bg-[#FFFFFF]',
                title: 'text-[#111827] dark:text-[#F8FAFC]',
                confirmButton: 'bg-[#D32F2F] hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336]',
                cancelButton: 'bg-gray-300 hover:bg-gray-400 dark:bg-[#334155] dark:hover:bg-[#475569]',
            },
        }).then((result) => {
            if (result.isConfirmed) {

                deleteUserFirebase()
                    .then(() => {
                        deleteUser({ email })
                        console.log('user deleted');
                    })
                    .catch(err => {
                        console.log('error deleting user', err);
                    })
            }
        });
    }


    if (loading) {
        return (
            <div className="bg-[#FFFFFF] dark:bg-[#0F172A] min-h-[calc(100vh-110px)] mt-20 py-10 rounded-tl-[35px] rounded-tr-[5px] rounded-bl-[50px] shadow-2xl relative">
                <div className="absolute w-20 h-20 rounded-full -top-8 -right-2 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                <div className="absolute top-0 right-20">
                    <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-6 w-40 rounded-md"></div>
                </div>
                <div className="px-10 mt-16">
                    <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-8 w-40 mb-8 rounded-md"></div>
                    <div className="flex gap-5">
                        <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-10 w-32 rounded-md"></div>
                        <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-10 w-32 rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] min-h-[calc(100vh-110px)] mt-20 py-10 rounded-tl-[35px] rounded-tr-[5px] rounded-bl-[50px] shadow-2xl relative">
            {/* user photo */}
            <div className="absolute w-20 h-20 rounded-full -top-8 -right-2 bg-[#1E2939] p-1">
                {user?.photoURL ? (
                    <img src={`${user?.photoURL}`} alt="" className="rounded-full" />
                ) : (
                    <div className="flex justify-center items-center text-white">
                        <FaRegCircleUser size={65} />
                    </div>
                )}
            </div>
            <div className="absolute top-0 right-20">
                <h4 className="font-bold text-2xl py-2 text-[#D32F2F] dark:text-[#EF5350]">
                    {`${user?.displayName ? user.displayName : user?.email ? user.email : 'Anonymous User'}`}
                </h4>
            </div>

            <h3 className="px-10 text-2xl mb-8 text-[#111827] dark:text-[#F8FAFC]">Quick Actions</h3>

            <div className="flex gap-5 px-10">
                <div>
                    <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="btn px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors">
                        Update Profile
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => handleDelete(user)}
                        disabled={isPending}
                        className="btn px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors border-none"
                    >
                        {
                            isPending ? <span className="loading loading-spinner text-neutral"></span>
                                : 'Delete Account'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setting;