import React, { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

const statusOptions = ["all", "pending", "in_progress", "done", "canceled"];
const DonationRequestLayout = ({ statusFilter, handleStatusChange, isLoading, donationRequests, currentPage, limit, handleDelete, handleStatusUpdate, setCurrentPage, totalPages, title, role_loading, allowDelete }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

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

    const parentVariants = {
        initial: { scale: 0.75, opacity: 0, filter: 'blur(20px)' },
        animate: { scale: 1, opacity: 1, filter: 'blur(0px' },
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
    }

    return (
        <motion.div
            variants={parentVariants}
            initial="initial"
            animate="animate"
            transition="transition"
            className="p-4 dark:text-white min-h-screen">
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
                                            <span className={`badge ${request.status === "done"
                                                ? "badge-success"
                                                : request.status === "pending"
                                                    ? "badge-warning"
                                                    : request.status === "in_progress"
                                                        ? "badge-info"
                                                        : "badge-error"
                                                }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>
                                            {request.status === 'in_progress' || request.status === 'done' ? `${request.donor_name} (${request.donor_email || '--'})(${request.donor_number || '--'})` : '--'}
                                        </td>
                                        <td className="flex justify-center gap-2">
                                            <button
                                                className="btn btn-sm btn-outline btn-info cursor-pointer"
                                                onClick={() => openModal(request)}
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            {
                                                allowDelete && <button
                                                className="btn btn-sm btn-outline btn-error cursor-pointer"
                                                onClick={() => handleDelete(request._id)}
                                                title="Delete Request"
                                            >
                                                <FaTrash />
                                            </button>
                                            }
                                            {request.status === "in_progress" && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-error cursor-pointer"
                                                        onClick={() => handleStatusUpdate(request._id, 'canceled', request.donor_email)}
                                                        title="Cancel Request"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline btn-success cursor-pointer"
                                                        onClick={() => handleStatusUpdate(request._id, 'done', request.donor_email)}
                                                        title="Mark as Done"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                </>
                                            )}
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
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && selectedRequest && (
                    <motion.div
                        initial={{ scale: 0.75, opacity: 0, filter: 'blur(20px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ scale: 0.5, opacity: 0, filter: 'blur(20px)' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
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
                            {(selectedRequest.status === 'done' || selectedRequest.status === 'in_progress') && (
                                <p><strong>
                                    {
                                        selectedRequest.status === 'done' ? 'Donate By:' : selectedRequest.status === 'in_progress' ? 'Donor Info:' : ''
                                    }
                                </strong> {selectedRequest.donor_name}  ({selectedRequest.donor_email ? selectedRequest.donor_email : '--'}) ({selectedRequest.donor_number ? selectedRequest.donor_number : '--'})</p>
                            )}
                            {
                                (selectedRequest.status === 'done' || selectedRequest.status === 'canceled') &&
                                <p>
                                    <strong>
                                        {
                                            selectedRequest.status === 'done' ? 'Donated ' : 'Canceled '
                                        }
                                    </strong>
                                    at {selectedRequest.status === 'done' ? formatDateTimeSimple(selectedRequest.donated_at)
                                        : formatDateTimeSimple(selectedRequest.canceled_at)}
                                </p>
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
    );
};

export default DonationRequestLayout;