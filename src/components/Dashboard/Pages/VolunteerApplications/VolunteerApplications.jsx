import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const VolunteerApplications = () => {
const axiosSecure = useAxiosSecure();
    const [selectedApp, setSelectedApp] = useState(null);

    // Fetch volunteer applications
    const { data: applications = [], isLoading, refetch } = useQuery({
        queryKey: ['volunteer-applications'],
        queryFn: async () => {
            const response = await axiosSecure.get('/volunteer-applications');
            return response.data;
        },
    });

    // Mutation to update application status
    const { mutate } = useMutation({
        mutationFn: async ({ id, status, email }) => {
            const response = await axiosSecure.patch(`/volunteer-applications/${id}`, { status, email });
            return response.data;
        },
        onSuccess: (data) => {
            console.log(data);
            refetch();
            setSelectedApp(null); // Close modal on success
            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: 'The volunteer application status has been updated.',
                confirmButtonColor: '#111827',
                customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
            });
        },
        onError: () => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update application status. Please try again.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        },
    });

    const handleAction = (id, status, email) => {
        Swal.fire({
            title: `Are you sure you want to ${status} this application?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            cancelButtonColor: '#D32F2F',
            confirmButtonText: 'Yes, confirm',
            customClass: {
                confirmButton: 'dark:bg-[#F8FAFC]',
                cancelButton: 'dark:bg-[#EF5350]',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(id, status);
                mutate({ id, status, email });
            }
        });
    };

    // Skeleton Loader
    const SkeletonLoader = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl w-full mx-auto bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155]"
        >
            <div className="animate-pulse space-y-6">
                <div className="h-10 bg-[#E5E7EB] dark:bg-[#334155] rounded w-1/3 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-[#F9FAFB] dark:bg-[#1E293B] p-4 rounded-lg shadow border border-[#E5E7EB] dark:border-[#334155]"
                        >
                            <div className="space-y-3">
                                <div className="h-6 bg-[#E5E7EB] dark:bg-[#334155] rounded w-3/4"></div>
                                <div className="h-5 bg-[#E5E7EB] dark:bg-[#334155] rounded w-5/6"></div>
                                <div className="h-5 bg-[#E5E7EB] dark:bg-[#334155] rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    // Modal Component
    const ApplicationModal = ({ app, onClose }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155] max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">
                        Application Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#4B5563] dark:text-[#94A3B8] hover:text-[#D32F2F] dark:hover:text-[#EF5350]"
                    >
                        <FaTimesCircle size={24} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Name:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.name}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Email:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.email}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Phone:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.phone}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Date of Birth:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.dob}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Occupation:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.occupation}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Blood Group:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.bloodGroup}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Availability:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words max-w-full">{app.availability}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Emergency Contact:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.emergencyContact}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Address:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words max-w-full">{app.address}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Motivation:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words max-w-full">{app.motivation}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Status:</span>
                        <p className="text-[#4B5563] dark:text-[#94A3B8] capitalize">{app.status}</p>
                    </div>
                    {app.status === 'pending' && (
                        <div className="flex gap-4 pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 p-3 bg-[#22C55E] dark:bg-[#4CAF50] text-white rounded-md hover:bg-[#16A34A] dark:hover:bg-[#45A049] disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleAction(app._id, 'accepted',app.email)}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FaCheck />
                                    <span>Accept</span>
                                </div>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 p-3 bg-[#D32F2F] dark:bg-[#EF5350] text-white rounded-md hover:bg-[#B71C1C] dark:hover:bg-[#F44336] disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => handleAction(app._id, 'rejected', app.email)}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <FaTimes />
                                    <span>Reject</span>
                                </div>
                            </motion.button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white dark:bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-6xl w-full mx-auto bg-[#F9FAFB] dark:bg-[#1E293B] p-8 rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#334155]"
            >
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-center text-[#111827] dark:text-[#F8FAFC] mb-6 flex items-center justify-center gap-2"
                >
                    <FaUserPlus className="text-[#D32F2F] dark:text-[#EF5350]" />
                    Volunteer Applications
                </motion.h2>
                {isLoading ? (
                    <SkeletonLoader />
                ) : applications.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-center text-lg text-[#4B5563] dark:text-[#94A3B8]"
                    >
                        No volunteer applications found.
                    </motion.p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {applications.map((app, index) => (
                            <motion.div
                                key={app._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                                className="bg-[#F9FAFB] dark:bg-[#1E293B] p-4 rounded-lg shadow border border-[#E5E7EB] dark:border-[#334155] cursor-pointer hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                onClick={() => setSelectedApp(app)}
                            >
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Name:</span>
                                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Email:</span>
                                        <p className="text-[#4B5563] dark:text-[#94A3B8] break-words">{app.email}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Status:</span>
                                        <p className="text-[#4B5563] dark:text-[#94A3B8] capitalize">{app.status}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
            <AnimatePresence>
                {selectedApp && (
                    <ApplicationModal app={selectedApp} onClose={() => setSelectedApp(null)} />
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default VolunteerApplications;