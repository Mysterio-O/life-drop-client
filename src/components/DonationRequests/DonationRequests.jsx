import React, { useState } from 'react'
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { motion } from 'motion/react';

const DonationRequests = () => {
    const axiosPublic = useAxiosPublic();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data: responseData = {}, isLoading } = useQuery({
        queryKey: ["pending-donation-requests", currentPage],
        queryFn: async () => {
            const res = await axiosPublic.get(`/donation-requests/pending?page=${currentPage}&limit=${limit}`);
            return res.data;
        },
    });

    const pendingRequests = responseData.result || [];
    const totalRequests = responseData.total || 0;
    const totalPages = Math.ceil(totalRequests / limit);
    // console.log(pendingRequests);

    const fnHandleTime = (time) => {
        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(12)].map((_, index) => (
                        <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg animate-pulse shadow">
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-4"></div>
                            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 my-10">
            <motion.h2
                initial={{ x: -20, opacity: 0, scale: 0.85 }}
                animate={{ x: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-4xl text-center font-semibold mb-6 text-[#111827] dark:text-[#F8FAFC]">
                Pending Donation Requests
            </motion.h2>

            {pendingRequests.length === 0 ? (
                <motion.p
                    initial={{ x: -20, opacity: 0, scale: 0.85 }}
                    animate={{ x: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="text-gray-500 dark:text-gray-400 text-center">No pending requests found.</motion.p>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-5">
                        {pendingRequests.map((req, idx) => (
                            <motion.div
                                key={req._id}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-200 text-center md:text-start dark:hover:bg-gray-700 hover:bg-gray-200 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-[#D32F2F] dark:text-red-400">{req.recipientName}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Location:</strong> {req.district}, {req.division}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Blood Group:</strong> {req.bloodGroup}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Date:</strong> {req.donationDate}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        <strong>Time:</strong> {fnHandleTime(req.donationTime)}
                                    </p>
                                </div>
                                <motion.div
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4">
                                    <Link
                                        to={`/donation-request/${req._id}`}
                                        className="btn btn-sm bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 btn-block"
                                    >
                                        View
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination - Only show if totalPages > 1 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline text-[#D32F2F] dark:text-red-400'} hover:bg-gray-100 dark:hover:bg-gray-700`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default DonationRequests;