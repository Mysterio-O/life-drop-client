import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEllipsisV, FaLock, FaUnlock, FaUserShield, FaUserTie, FaUserTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useUserRole from '../../../hooks/useUserRole';
import { motion } from 'motion/react';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { user, loading } = useAuth();
    const { role, role_loading } = useUserRole();

    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: userData = {}, isLoading } = useQuery({
        queryKey: ['all-users', page, statusFilter, user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-users?page=${page}&limit=${limit}&status=${statusFilter}&email=${user.email}`);
            return res.data;
        }
    });
    // console.log(userData);

    const users = userData.users || [];
    const totalPages = userData.totalPages || 1;

    const { mutate: updateUserStatus } = useMutation({
        mutationFn: async ({ userId, status }) => {
            const res = await axiosSecure.patch(`/user/${userId}/status`, { status });
            return res.data.result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['all-users']);
            console.log(data);
            if (data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                        icon: 'text-[#D32F2F] text-xl',
                    },
                    html: '<span>Status updated!</span>',
                });
            }
        },
        onError: (error) => {
            console.log('error changing user status', error)
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                    icon: 'text-[#D32F2F] text-xl',
                },
                html: '<span>Error updating status.</span>',
            });
        }
    });

    const { mutate: updateUserRole } = useMutation({
        mutationFn: async ({ userId, role }) => {
            const res = await axiosSecure.patch(`/user/${userId}/role`, { role });
            return res.data.result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['all-users']);
            console.log(data);
            Swal.fire({
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                    icon: 'text-[#D32F2F] text-xl',
                },
                html: '<span>Role updated!</span>',
            });

        },
        onError: (error) => {
            console.log('error updating user role', error);
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                    icon: 'text-[#D32F2F] text-xl',
                },
                html: '<span>Error updating role.</span>',
            });
        }
    });

    const handleStatusChange = (user, newStatus) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `You want to ${newStatus} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserStatus({ userId: user._id, status: newStatus });
            }
        });
    };

    const handleRoleChange = (user, newRole) => {
        Swal.fire({
            title: `Are you sure?`,
            text: `Make this user an ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserRole({ userId: user._id, role: newRole });
            }
        });
    };

    if (isLoading || role_loading || loading) {
        return (
            <div className="p-4">
                <div className="flex justify-between mb-4 items-center">
                    <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="table w-full bg-white dark:bg-gray-900 text-[#111827] dark:text-[#F8FAFC] rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-[#D32F2F]">
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <td className="p-3"><div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div></td>
                                    <td className="p-3"><div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div></td>
                                    <td className="p-3"><div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div></td>
                                    <td className="p-3"><div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div></td>
                                    <td className="p-3"><div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div></td>
                                    <td className="p-3"><div className="h-6 w-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 space-x-2">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-8 w-8 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: 'blur(15px)',y:-100 }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)',y:0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="p-4">
            <div className="flex justify-between mb-4 items-center">
                <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F8FAFC]">All Users</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setPage(1);
                        setStatusFilter(e.target.value);
                    }}
                    className="select select-bordered bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] border-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full bg-white dark:bg-gray-900 text-[#111827] dark:text-[#F8FAFC] rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-[#D32F2F] dark:text-white">
                            <th className="p-3 text-left">Avatar</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            {
                                role === 'admin' && <th className="p-3 text-left">Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <td className="p-3"><img src={user.photoURL} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-[#D32F2F]" /></td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">
                                    <span className={`badge ${user.role === 'admin' ? 'bg-blue-500' : user.role === 'volunteer' ? 'bg-yellow-500' : 'bg-green-500'} text-white capitalize`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`badge ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white capitalize`}>
                                        {user.status}
                                    </span>
                                </td>
                                {
                                    role === "admin" && <td className="p-3">
                                        <div className="dropdown dropdown-end">
                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white">
                                                <FaEllipsisV />
                                            </div>
                                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white dark:bg-gray-800 rounded-box w-52 border border-[#D32F2F]">
                                                {user.status === 'active' && (
                                                    <li><button onClick={() => handleStatusChange(user, 'blocked')} className="text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"><FaLock /> Block</button></li>
                                                )}
                                                {user.status === 'blocked' && (
                                                    <li><button onClick={() => handleStatusChange(user, 'active')} className="text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"><FaUnlock /> Unblock</button></li>
                                                )}
                                                {user.role !== 'volunteer' && (
                                                    <li><button onClick={() => handleRoleChange(user, 'volunteer')} className="text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"><FaUserTie /> Make Volunteer</button></li>
                                                )}
                                                {user.role !== 'admin' && (
                                                    <li><button onClick={() => handleRoleChange(user, 'admin')} className="text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"><FaUserShield /> Make Admin</button></li>
                                                )}
                                                {
                                                    user.role === 'volunteer' && (
                                                        <li><button onClick={() => handleRoleChange(user, 'donor')} className="text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"><FaUserTimes />Remove Volunteer</button></li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx + 1)}
                        className={`btn btn-sm ${page === idx + 1 ? 'bg-[#D32F2F] text-white' : 'bg-white dark:bg-gray-800 text-[#D32F2F] border border-[#D32F2F] hover:bg-[#D32F2F] hover:text-white'} transition-colors duration-200`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default AllUsers;