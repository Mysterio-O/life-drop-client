import React, { useState } from 'react';
import { easeInOut, motion } from 'motion/react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { MdEdit, MdDelete, MdVisibility, MdCheckCircle, MdCancel } from 'react-icons/md';
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

    const handleStatusUpdate = (id, status) => {
        axiosSecure.patch(`/donation-requests/${id}`, { status })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                }
            });
    };

    const openModal = (request) => setSelectedRequest(request);
    const closeModal = () => setSelectedRequest(null);

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

    const fnHandleTime = (time) => {
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";

    // Convert hour to 12-hour format
    hour = hour % 12 || 12;

    const formattedTime = `${hour}:${minute} ${ampm}`;
    return formattedTime;
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
                                                <td className="capitalize text-center">{req.status}</td>
                                                <td>
                                                    {req.status === 'in_progress' ? `${req.donor_name} (${req.donor_email})` : '--'}
                                                </td>
                                                <td className="flex justify-center gap-2">
                                                    {req.status === 'in_progress' && (
                                                        <>
                                                            <button className='cursor-pointer' onClick={() => handleStatusUpdate(req._id, 'done')}>
                                                                <MdCheckCircle />
                                                            </button>
                                                            <button className='cursor-pointer' onClick={() => handleStatusUpdate(req._id, 'canceled')}>
                                                                <MdCancel />
                                                            </button>
                                                        </>
                                                    )}
                                                    {
                                                        req.status !== 'done' && <Link to={`/dashboard/edit-request/${req._id}`}><MdEdit /></Link>
                                                    }
                                                    <button className='cursor-pointer' onClick={() => handleDelete(req._id)}><MdDelete /></button>
                                                    <button className='cursor-pointer' onClick={() => openModal(req)}><MdVisibility /></button>
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

                {selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-xl shadow-lg max-w-sm w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Request Details</h3>
                            <button onClick={closeModal} className="absolute top-2 right-2">
                                ✕
                            </button>
                            <div className="space-y-3">
                                <p><strong>Recipient:</strong> {selectedRequest.recipientName}</p>
                                <p><strong>Location:</strong> {selectedRequest.district}, {selectedRequest.upazila}</p>
                                <p><strong>Date:</strong> {selectedRequest.donationDate}</p>
                                <p><strong>Time:</strong> {fnHandleTime(selectedRequest.donationTime)}</p>
                                <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                                <p><strong>Status:</strong> {selectedRequest.status}</p>
                                {selectedRequest.status === 'in_progress' && (
                                    <>
                                        <p><strong>Donor Name:</strong> {selectedRequest.donor_name}</p>
                                        <p><strong>Donor Email:</strong> {selectedRequest.donor_email}</p>
                                    </>
                                )}
                                <p><strong>Hospital:</strong> {selectedRequest.hospitalName}</p>
                                <p><strong>Address:</strong> {selectedRequest.address}</p>
                                <p><strong>Message:</strong> {selectedRequest.requestMessage}</p>
                                {
                                    selectedRequest.status === 'done' && <>
                                        <p><strong>Donated by:</strong> {selectedRequest.donor_name}</p>
                                        <p><strong>Donor email:</strong> {selectedRequest.donor_email}</p>
                                    </>
                                }
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default OverView;
