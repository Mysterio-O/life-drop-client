import React, { useState } from 'react';
import { motion,AnimatePresence } from 'motion/react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { FaEye, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { FaPlusSquare } from 'react-icons/fa';

const OverView = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: donationRequests = [], isPending, refetch } = useQuery({
        queryKey: ['donation_requests', user?.email],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`/requests?email=${user.email}&limit=3`);
            return res.data.result;
        }
    });

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleStatusUpdate = async (id, newStatus) => {
        const statusMessages = {
            done: {
                title: "Mark as Done?",
                text: "This will complete the request.",
                icon: "question",
                success: "Request marked as done."
            },
            canceled: {
                title: "Cancel Request?",
                text: "This will mark the request as canceled but keep it in your history.",
                icon: "warning",
                success: "Request has been canceled."
            }
        };

        const confirm = await Swal.fire({
            title: statusMessages[newStatus].title,
            text: statusMessages[newStatus].text,
            icon: statusMessages[newStatus].icon,
            showCancelButton: true,
            confirmButtonText: `Yes, ${newStatus === 'done' ? 'mark done' : 'cancel it'}`,
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/donation-requests/${id}`, { status: newStatus });
                if (res.data.result.modifiedCount) {
                    Swal.fire("Success!", statusMessages[newStatus].success, "success");
                    refetch();
                }
            } catch (err) {
                console.log(`error updating status to ${newStatus}`, err);
                Swal.fire("Error", "Something went wrong.", "error");
            }
        }
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const fnHandleTime = (time) => {
        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    if (loading || isPending) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="skeleton h-8 w-1/2 mb-6"></div>
                <div className="max-w-3xl w-full bg-base-200 p-6 rounded-lg shadow-md space-y-4">
                    <div className="skeleton h-6 w-full"></div>
                    <div className="skeleton h-6 w-full"></div>
                    <div className="skeleton h-6 w-full"></div>
                    <div className="skeleton h-6 w-full"></div>
                    <div className="skeleton h-6 w-full"></div>
                </div>
            </div>
        );
    };

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
                {
                    donationRequests.length === 0 ? (
                        <div className='text-black dark:text-white'>
                            <p className='text-center text-2xl font-semibold'>You haven't added any request yet!</p>
                            <motion.div
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <Link to="/dashboard/create-donation-request" className="flex items-center justify-center gap-2 text-xl mt-5">
                                    Create Request
                                    <FaPlusSquare />
                                </Link>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-[#F8FAFC]">
                                Your Recent Donation Requests
                            </h3>
                            <div className="w-full overflow-x-auto">
                                <table className="table w-full border-separate border-spacing-0 dark:text-white">
                                    <thead className='dark:text-white'>
                                        <tr>
                                            <th className="text-center">#</th>
                                            <th className="text-left">Recipient</th>
                                            <th className="text-left">Location</th>
                                            <th className="text-center">Date</th>
                                            <th className="text-center">Time</th>
                                            <th className="text-center">Blood</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-left">Donor Info</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donationRequests.map((req, index) => (
                                            <tr key={req._id} className="hover:bg-[#E5E7EB] dark:hover:bg-[#334155]">
                                                <td className="text-center">{index + 1}</td>
                                                <td>{req.recipientName}</td>
                                                <td>{`${req.district}, ${req.upazila}`}</td>
                                                <td className="text-center">{req.donationDate}</td>
                                                <td className="text-center">{fnHandleTime(req.donationTime)}</td>
                                                <td className="text-center">{req.bloodGroup}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${req.status === 'done'
                                                        ? 'badge-success'
                                                        : req.status === 'pending'
                                                            ? 'badge-warning'
                                                            : req.status === 'in_progress'
                                                                ? 'badge-info'
                                                                : 'badge-error'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {req.status === 'in_progress' || req.status === 'done' ? `${req.donor_name} (${req.donor_email || '--'})` : '--'}
                                                </td>
                                                <td className="flex justify-center gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline btn-info cursor-pointer"
                                                        onClick={() => openModal(req)}
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    {(req.status === "pending" || req.status === "in_progress") && (
                                                        <>
                                                            <button
                                                                className="btn btn-sm btn-outline btn-error cursor-pointer"
                                                                onClick={() => handleStatusUpdate(req._id, 'canceled')}
                                                                title="Cancel Request"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline btn-error cursor-pointer"
                                                                onClick={() => handleDelete(req._id)}
                                                                title="Delete Request"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
                                                    {req.status === "in_progress" && (
                                                        <button
                                                            className="btn btn-sm btn-outline btn-success cursor-pointer"
                                                            onClick={() => handleStatusUpdate(req._id, 'done')}
                                                            title="Mark as Done"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-center mt-6">
                                <Link to="/dashboard/my-donation-requests" className="btn btn-outline text-[#D32F2F] dark:text-[#EF5350]">
                                    View My All Requests
                                </Link>
                            </div>
                        </motion.div>
                    )
                }

                <AnimatePresence>
                    {isModalOpen && selectedRequest && (
                        <motion.div
                            initial={{ scale: 0.75, opacity: 0, filter: 'blur(20px)' }}
                            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
                        >
                            <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-md w-full relative dark:text-white">
                                <h3 className="text-xl font-bold mb-4">Donation Request Details</h3>
                                <p><strong>Recipient:</strong> {selectedRequest.recipientName}</p>
                                <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                                <p><strong>Description:</strong> {selectedRequest.requestMessage}</p>
                                <p><strong>Location:</strong> {selectedRequest.district}, {selectedRequest.upazila}</p>
                                <p><strong>Hospital Name:</strong> {selectedRequest.hospitalName}</p>
                                <p><strong>Address:</strong> {selectedRequest.address}</p>
                                <p><strong>Donation Date:</strong> {selectedRequest.donationDate}</p>
                                <p><strong>Donation Time:</strong> {fnHandleTime(selectedRequest.donationTime)}</p>
                                <p><strong>Status:</strong> {selectedRequest.status}</p>
                                <p><strong>Requester:</strong> {selectedRequest.requesterName} ({selectedRequest.requesterEmail})</p>
                                {
                                    selectedRequest.status === 'done' && <p><strong>Donate By:</strong> {selectedRequest.donor_name}({selectedRequest.donor_email ? selectedRequest.donor_email : '--'})</p>
                                }

                                <div className="mt-6 text-right">
                                    <button
                                        onClick={closeModal}
                                        className="btn btn-sm btn-outline"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default OverView;