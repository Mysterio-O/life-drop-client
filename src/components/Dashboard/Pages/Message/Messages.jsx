import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaUser, FaEllipsisV } from 'react-icons/fa';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const Messages = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading: messageLoading } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-messages');
            return res.data.messages;
        }
    });

    const [dropdownOpen, setDropdownOpen] = useState(null);

    useEffect(()=> {
        document.title = "All Messages"
    },[])


    const { mutate: handleRead } = useMutation({
        mutationFn: async ({ id }) => {
            const res = await axiosSecure.patch(`/message/${id}/update`);
            return res.data.result
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['messages']);
            console.log('from on success->', data);
            if (data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Marked as Read',
                    text: 'Message marked as read.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
            }
        }
    });

    const { mutate: deleteMessage } = useMutation({
        mutationFn: async ({ id }) => {
            const res = await axiosSecure.delete(`/message/${id}/delete`);
            return res.data.result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['messages']);
            if (data.deletedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Message has been deleted.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
            }
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete message.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        }
    })


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the message!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'dark:bg-[#EF5350]',
                cancelButton: 'dark:bg-[#4B5563]',
            },
        });

        if (result.isConfirmed) {
            deleteMessage({ id });
        }
        setDropdownOpen(null);
    };

    const handleMarkAsRead = (id) => {
        Swal.fire({
            title: 'Mark as Read?',
            text: 'Are you sure you want to mark this message as read?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, Mark',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'dark:bg-[#F8FAFC]',
                cancelButton: 'dark:bg-[#4B5563]',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // Placeholder for marking as read (extend backend if needed)
                console.log(`Marked as read: ${id}`);
                handleRead({ id });
            }
            setDropdownOpen(null);
        });
    };

    if (messageLoading) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] p-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {[...Array(5)].map((_, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-300 dark:bg-gray-700 animate-pulse h-16 rounded-lg p-4"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] p-4">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-[#111827] dark:text-[#F8FAFC] mb-6">
                    Admin Messages
                </h2>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start p-4 bg-[#F9FAFB] dark:bg-[#1E293B] rounded-lg shadow-md relative"
                        >
                            <FaUser className="text-[#D32F2F] dark:text-[#EF5350] mr-3 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium text-[#111827] dark:text-[#F8FAFC]">
                                        {message.name} ({message.email})
                                    </span>
                                    <span className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                                        {new Date(message.sent_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-[#111827] dark:text-[#F8FAFC] mt-1">
                                    {message.message}
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(dropdownOpen === message._id ? null : message._id)}
                                    className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336] p-2"
                                >
                                    <FaEllipsisV />
                                </button>
                                {dropdownOpen === message._id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-36 bg-[#F9FAFB] dark:bg-[#1E293B] rounded-md shadow-lg ring-1 ring-[#E5E7EB] dark:ring-[#334155] z-10"
                                    >
                                        <ul className="py-1">
                                            <li>
                                                <button
                                                    onClick={() => handleMarkAsRead(message._id)}
                                                    className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#F8FAFC] hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
                                                >
                                                    Mark as Read
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => handleDelete(message._id)}
                                                    className="w-full text-left px-4 py-2 text-[#111827] dark:text-[#F8FAFC] hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
                                                >
                                                    Delete Message
                                                </button>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                {messages.length === 0 && (
                    <p className="text-center text-[#4B5563] dark:text-[#94A3B8]">
                        No messages available.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Messages;