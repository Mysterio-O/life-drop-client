import React, { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash, FaEdit, FaEllipsisV, FaExclamationTriangle } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from 'react-router';
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const statusOptions = ["all", "pending", "in_progress", "done", "canceled", "emergency"];
const DonationRequestLayout = ({ statusFilter, handleRequestEmergency, showEmergency, handleStatusChange, actionLoading, isLoading, donationRequests, currentPage, limit, handleDelete, handleStatusUpdate, setCurrentPage, totalPages, title, role_loading, allowDelete, isUser }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const fnHandleTime = (time) => {
        const [hourStr, minute] = time.split(":");
        let hour = parseInt(hourStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const parentVariants = {
        initial: { scale: 0.75, opacity: 0, filter: 'blur(20px)' },
        animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
        transition: { duration: 0.3, ease: 'easeInOut' }
    };

    const menuVariants = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2, ease: 'easeInOut' }
    };

    const loaderVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
        transition: { duration: 0.3, ease: 'easeInOut' }
    };

    const formatDateTimeSimple = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <motion.div
            variants={parentVariants}
            initial="initial"
            animate="animate"
            transition="transition"
            className="p-4 dark:text-white min-h-screen"
        >
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <label className="text-sm font-medium dark:text-white">
                    Filter by Status:
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="select select-bordered ml-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    >
                        {statusOptions.map((status) => (
                            <option
                                key={status}
                                value={status}
                                className="dark:bg-gray-800 dark:text-white"
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="overflow-x-auto">
                {isLoading || role_loading ? (
                    <div className="space-y-4">
                        {[...Array(11)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="h-6 bg-gray-300 rounded w-6"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <table className="table w-full border-separate border-spacing-0 dark:text-white">
                        <thead className="dark:text-white">
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
                            {donationRequests?.requests?.length > 0 ? (
                                donationRequests.requests.map((request, index) => (
                                    <tr key={request._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <td className="text-center">{(currentPage - 1) * limit + index + 1}</td>
                                        <td>{request.recipientName}</td>
                                        <td>{`${request.district}, ${request.division}`}</td>
                                        <td className="text-center">{request.donationDate}</td>
                                        <td className="text-center">{fnHandleTime(request.donationTime)}</td>
                                        <td className="text-center">{request.bloodGroup || '--'}</td>
                                        <td className="text-center">
                                            {
                                                request.emergencyRequest ? <span className="badge badge-info">
                                                    Requested
                                                </span>
                                                    : <span className={`badge ${request.status === "done"
                                                        ? "badge-success"
                                                        : request.status === "pending"
                                                            ? "badge-warning"
                                                            : request.status === "in_progress"
                                                                ? "badge-info"
                                                                : request.status === "emergency"
                                                                    ? "badge-error"
                                                                    : "badge-error"
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                            }
                                        </td>
                                        <td>
                                            {request.status === 'in_progress' || request.status === 'done' || request.status === 'emergency'
                                                ? `${request.donor_name} (${request.donor_email || '--'})(${request.donor_number || '--'})`
                                                : '--'}
                                        </td>
                                        <td className="text-center relative">
                                            <button
                                                className="btn btn-sm btn-outline btn-circle"
                                                onClick={() => toggleMenu(request._id)}
                                                title="Actions"
                                                disabled={actionLoading}
                                            >
                                                <FaEllipsisV />
                                            </button>
                                            <AnimatePresence>
                                                {openMenuId === request._id && (
                                                    <motion.div
                                                        variants={menuVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                        exit="exit"
                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-[#E5E7EB] dark:border-[#334155]"
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#3B82F6] dark:text-[#60A5FA] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                onClick={() => {
                                                                    openModal(request);
                                                                    toggleMenu(null);
                                                                }}
                                                                disabled={actionLoading}
                                                            >
                                                                <FaEye /> View Details
                                                            </button>
                                                            {allowDelete && (
                                                                <button
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#D32F2F] dark:text-[#EF5350] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                    onClick={() => {
                                                                        handleDelete(request._id);
                                                                        toggleMenu(null);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaTrash /> Delete Request
                                                                </button>
                                                            )}
                                                            {(request.status === "in_progress" || request.status === "pending") && (
                                                                <button
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#D32F2F] dark:text-[#EF5350] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                    onClick={() => {
                                                                        handleStatusUpdate(request._id, 'canceled', request.donor_email);
                                                                        toggleMenu(null);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaTimes /> Cancel Request
                                                                </button>
                                                            )}
                                                            {request.status === "in_progress" && (
                                                                <button
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#22C55E] dark:text-[#4CAF50] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                    onClick={() => {
                                                                        handleStatusUpdate(request._id, 'done', request.donor_email);
                                                                        toggleMenu(null);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaCheck /> Mark as Done
                                                                </button>
                                                            )}
                                                            {request.status === "pending" && isUser && (
                                                                <button
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#F59E0B] dark:text-[#FBBF24] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                    onClick={() => {
                                                                        navigate(`/dashboard/edit-request/${request._id}`);
                                                                        toggleMenu(null);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaEdit /> Edit Request
                                                                </button>
                                                            )}
                                                            {request.status === "pending" && showEmergency && (
                                                                <button
                                                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#F59E0B] dark:text-[#FBBF24] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                                                    onClick={() => {
                                                                        handleStatusUpdate(request._id, 'emergency', request.donor_email);
                                                                        toggleMenu(null);
                                                                    }}
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaExclamationTriangle /> Mark as Emergency
                                                                </button>
                                                            )}
                                                            {
                                                                request.status === "pending" && !showEmergency && (
                                                                    <button
                                                                        className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${request?.emergencyRequest ? 'text-green-500' : 'text-[#F59E0B] dark:text-[#FBBF24]'} hover:bg-[#F1F5F9] dark:hover:bg-[#475569]`}
                                                                        onClick={() => {
                                                                            handleRequestEmergency(request._id, 'emergency');
                                                                            toggleMenu(null);
                                                                        }}
                                                                        disabled={actionLoading || request?.emergencyRequest}
                                                                    >
                                                                        {
                                                                            request?.emergencyRequest ? <>
                                                                                <IoCheckmarkDoneOutline />
                                                                                <span className='text-balance'>
                                                                                    Requested
                                                                                </span>
                                                                            </>
                                                                                : <>
                                                                                    <FaExclamationTriangle />
                                                                                    <span className='text-balance'>
                                                                                        Req for Emergency
                                                                                    </span>
                                                                                </>
                                                                        }
                                                                    </button>
                                                                )
                                                            }
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-10 text-gray-400">
                                        No donation requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
                {[...Array(totalPages).keys()].map((i) => (
                    <button
                        key={i}
                        className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={actionLoading}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {actionLoading && (
                    <motion.div
                        variants={loaderVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-40"
                    >
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 border-4 border-t-[#D32F2F] dark:border-t-[#EF5350] border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
                            <p className="mt-4 text-white dark:text-[#F8FAFC] font-medium">Processing...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <motion.div
                        initial={{ scale: 0.75, opacity: 0, filter: 'blur(20px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-md w-full relative">
                            <h3 className="text-xl font-bold mb-4">Donation Request Details</h3>
                            <p><strong>Recipient:</strong> {selectedRequest.recipientName}</p>
                            <p><strong>Blood Group:</strong> {selectedRequest.bloodGroup}</p>
                            <p><strong>Description:</strong> {selectedRequest.requestMessage}</p>
                            <p><strong>Location:</strong> {selectedRequest.district}, {selectedRequest.division}</p>
                            <p><strong>Hospital Name:</strong> {selectedRequest.hospitalName}</p>
                            <p><strong>Address:</strong> {selectedRequest.address}</p>
                            <p><strong>Donation Date:</strong> {selectedRequest.donationDate}</p>
                            <p><strong>Donation Time:</strong> {fnHandleTime(selectedRequest.donationTime)}</p>
                            <p><strong>Status:</strong> {selectedRequest.status}</p>
                            <p><strong>Requester:</strong> {selectedRequest.requesterName} ({selectedRequest.requesterEmail})</p>
                            {(selectedRequest.status === 'done' || selectedRequest.status === 'in_progress' || selectedRequest.status === 'emergency') && (
                                <p>
                                    <strong>
                                        {selectedRequest.status === 'done' ? 'Donated By:' :
                                            selectedRequest.status === 'in_progress' ? 'Donor Info:' :
                                                selectedRequest.status === 'emergency' ? 'Donor Info:' : ''}
                                    </strong> {selectedRequest.donor_name} ({selectedRequest.donor_email || '--'}) ({selectedRequest.donor_number || '--'})
                                </p>
                            )}
                            {(selectedRequest.status === 'done' || selectedRequest.status === 'canceled') && (
                                <p>
                                    <strong>
                                        {selectedRequest.status === 'done' ? 'Donated ' : 'Canceled '}
                                    </strong>
                                    at {selectedRequest.status === 'done' ? formatDateTimeSimple(selectedRequest.donated_at)
                                        : formatDateTimeSimple(selectedRequest.canceled_at)}
                                </p>
                            )}
                            <div className="mt-6 text-right">
                                <button
                                    onClick={closeModal}
                                    className="btn btn-sm btn-outline"
                                    disabled={actionLoading}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DonationRequestLayout;