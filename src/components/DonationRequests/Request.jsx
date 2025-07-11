import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { motion } from 'motion/react';
import { IoIosDoneAll } from 'react-icons/io';

const Request = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [mobile, setMobile] = useState('');

    const { data: donationRequest = {}, isLoading } = useQuery({
        queryKey: ['donation-request', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`donation-request/${id}`);
            return res.data;
        },
    });

    const { mutate: confirmDonation, isPending } = useMutation({
        mutationFn: async () => {
            const res = await axiosSecure.patch(`/donation-requests/${id}`, {
                status: 'in_progress',
                donorMobile: mobile || null,
                donorEmail: user.email || '',
                donorName: user.displayName || ''
            });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire('Success!', 'Donation confirmed.', 'success');
            setShowModal(false);
            queryClient.invalidateQueries(['donation-request', id]);
        },
        onError: () => {
            Swal.fire('Error', 'Something went wrong.', 'error');
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
                <div className="skeleton h-10 w-2/3 mb-6 dark:bg-gray-700"></div>
                <div className="max-w-3xl w-full bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4">
                    {[...Array(7)].map((_, idx) => (
                        <div key={idx} className="skeleton h-6 w-full dark:bg-gray-700"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl min-h-[calc(100vh-64px)] mx-auto p-4 dark:text-white"
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                Donation Request Details
            </h2>
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 space-y-4"
            >
                <div className="flex flex-col gap-4 divide-y">
                    <div className="flex justify-between items-center py-2">
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Created At:</strong> {new Date(donationRequest.createdAt).toLocaleDateString()}</p>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Requester Name:</strong> {donationRequest.requesterName}</p>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Requester Email:</strong> {donationRequest.requesterEmail}</p>
                        <p className="text-lg col-span-2 text-center"><strong className="text-[#111827] dark:text-[#F8FAFC]">Status:</strong> {donationRequest.status}</p>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Recipient Name:</strong> {donationRequest.recipientName}</p>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Recipient Number:</strong> {donationRequest.recipientNumber}</p>
                    </div>
                    <div className='flex justify-around items-center py-2'>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Division:</strong> {donationRequest.division}</p>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">District:</strong> {donationRequest.district}</p>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Upazila:</strong> {donationRequest.upazila}</p>
                    </div>

                    <div className='flex justify-between items-center py-2'>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Hospital Name:</strong> {donationRequest.hospitalName}</p>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Address:</strong> {donationRequest.address}</p>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Blood Group:</strong> {donationRequest.bloodGroup}</p>
                        <p className="text-lg col-span-2"><strong className="text-[#111827] dark:text-[#F8FAFC]">Request Message:</strong> {donationRequest.requestMessage}</p>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                        <p className="text-lg text-right"><strong className="text-[#111827] dark:text-[#F8FAFC]">Donation Date:</strong> {donationRequest.donationDate}</p>
                        <p className="text-lg"><strong className="text-[#111827] dark:text-[#F8FAFC]">Donation Time:</strong> {donationRequest.donationTime}</p>
                    </div>


                </div>

                {donationRequest.status === 'pending' && user.email !== donationRequest.requesterEmail && (
                    <div className="flex justify-center mt-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                        >
                            Donate
                        </motion.button>
                    </div>
                )}
            </motion.div>

            {/* Modal */}
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-4 text-center text-[#111827] dark:text-[#F8FAFC]">Confirm Donation</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Name</label>
                                <input type="text" readOnly value={user?.displayName || ''} className="input input-bordered w-full bg-gray-100 dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Email</label>
                                <input type="email" readOnly value={user?.email || ''} className="input input-bordered w-full bg-gray-100 dark:bg-gray-800" />
                            </div>
                            <div>
                                <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Mobile (optional)</label>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(false)}
                                className="btn btn-outline text-[#D32F2F] dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={confirmDonation}
                                disabled={isPending}
                                className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                {isPending ? 'Confirming...' : 'Confirm'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Request;