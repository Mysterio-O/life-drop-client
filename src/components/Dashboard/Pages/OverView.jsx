import React, { useState } from 'react';
import { motion } from 'motion/react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { MdEdit, MdDelete, MdVisibility, MdCheckCircle, MdCancel } from 'react-icons/md';

const OverView = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: donationRequests = [],isPending,refetch } = useQuery({
        queryKey: ['donation_requests', user.email],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`/requests?email=${user.email}&limit=3`);
            return res.data.result;
        }
    });

    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            cancelButtonColor: '#EF5350',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'dark:bg-[#EF5350]',
                cancelButton: 'dark:bg-[#D32F2F]',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/donation-requests/${id}`)
                    .then(res => {
                        if (res.data.result.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'Your request has been deleted.',
                                confirmButtonColor: '#111827',
                                customClass: {
                                    confirmButton: 'dark:bg-[#F8FAFC]',
                                },
                            });
                        }
                    });
            }
        });
    };

    if(isPending){
        return(
            <div className='min-h-screen flex justify-center items-center'>
                <p className="text-2xl text-black dark:text-white">Loading request info</p>
            </div>
        )
    }

    const handleStatusUpdate = (id, status) => {
        axiosSecure.patch(`/donation-requests/${id}`, { status })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                }
            });
    };

    const openModal = (request) => {
        setSelectedRequest(request);
    };

    const closeModal = () => {
        setSelectedRequest(null);
    };

    if (loading) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#0F172A] p-4 overflow-hidden"
        >
            <h2 className="text-3xl font-semibold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                Welcome Back {user.displayName}!
            </h2>
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-4 sm:p-6 rounded-xl shadow-md"
            >
                {donationRequests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-[#F8FAFC]">
                            Your Recent Donation Requests
                        </h3>
                        <div className="w-full overflow-x-auto">
                            <table className="table w-full border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{"#"}</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-left border border-transparent">Recipient</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-left border border-transparent">Location</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">Date</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">Time</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">Blood</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">Status</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-left border border-transparent">Donor Info</th>
                                        <th className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donationRequests.map((req, index) => (
                                        <tr key={req._id} className="hover:bg-[#E5E7EB] dark:hover:bg-[#334155] border border-transparent">
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{index + 1}</td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 whitespace-nowrap overflow-hidden text-ellipsis border border-transparent">
                                                {req.recipientName}
                                            </td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 whitespace-nowrap overflow-hidden text-ellipsis border border-transparent">
                                                {`${req.district}, ${req.upazila}`}
                                            </td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{req.donationDate}</td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{req.donationTime}</td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{req.bloodGroup}</td>
                                            <td className="capitalize text-[#111827] dark:text-[#F8FAFC] px-2 py-2 text-center border border-transparent">{req.status}</td>
                                            <td className="text-[#111827] dark:text-[#F8FAFC] px-2 py-2 whitespace-nowrap overflow-hidden text-ellipsis border border-transparent">
                                                {req.status === 'in_progress' ? `${req.donor_name} (${req.donor_email})` : '--'}
                                            </td>
                                            <td className="space-x-1 px-2 py-2 text-center border border-transparent">
                                                {req.status === 'inprogress' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'done')}
                                                            className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200"
                                                        >
                                                            <MdCheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, 'canceled')}
                                                            className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-200"
                                                        >
                                                            <MdCancel size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <div className='flex gap-2'>
                                                    <Link
                                                        to={`/dashboard/edit-request/${req._id}`}
                                                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                                                    >
                                                        <MdEdit size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(req._id)}
                                                        className="text-[#D32F2F] hover:text-[#B71C1C] dark:text-[#EF5350] dark:hover:text-[#F44336]"
                                                    >
                                                        <MdDelete size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(req)}
                                                        className="text-[#111827] hover:text-[#4B5563] dark:text-[#F8FAFC] dark:hover:text-[#94A3B8]"
                                                    >
                                                        <MdVisibility size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-center mt-6"
                        >
                            <Link
                                to="/dashboard/my-requests"
                                className="btn btn-outline text-[#D32F2F] dark:text-[#EF5350] border-[#D32F2F] dark:border-[#EF5350] hover:bg-[#D32F2F] dark:hover:bg-[#EF5350] hover:text-white transition-colors"
                            >
                                View My All Requests
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-30 flex items-center justify-center z-50"
                        style={{ width: '100vw', height: '100vh' }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#F9FAFB] dark:bg-[#1E293B] p-4 sm:p-6 rounded-xl shadow-lg min-w-[300px] max-w-sm w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-[#F8FAFC]">
                                Request Details
                            </h3>
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <div className="space-y-3 sm:space-y-4">
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Recipient:</span> {selectedRequest.recipientName}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Location:</span> {selectedRequest.district}, {selectedRequest.upazila}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Date:</span> {selectedRequest.donationDate}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Time:</span> {selectedRequest.donationTime}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Blood Group:</span> {selectedRequest.bloodGroup}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Status:</span> {selectedRequest.status}
                                </p>
                                {selectedRequest.status === 'in_progress' && (
                                    <div>
                                        <p className="text-[#111827] dark:text-[#F8FAFC]">
                                            <span className="font-semibold">Donor Name:</span> {selectedRequest.donor_name}
                                        </p>
                                        <p className="text-[#111827] dark:text-[#F8FAFC]">
                                            <span className="font-semibold">Donor Email:</span> {selectedRequest.donor_email}
                                        </p>
                                    </div>
                                )}
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Hospital:</span> {selectedRequest.hospitalName}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Address:</span> {selectedRequest.address}
                                </p>
                                <p className="text-[#111827] dark:text-[#F8FAFC]">
                                    <span className="font-semibold">Message:</span> {selectedRequest.requestMessage}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default OverView;