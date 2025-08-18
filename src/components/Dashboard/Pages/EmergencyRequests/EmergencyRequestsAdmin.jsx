import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FaEye, FaTimes, FaCheck, FaEllipsisV } from 'react-icons/fa';
import { FcAcceptDatabase } from "react-icons/fc";
import { AnimatePresence, motion } from 'motion/react';
import Swal from 'sweetalert2';
import useUserRole from '../../../../hooks/useUserRole';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const EmergencyRequestsAdmin = () => {
  const navigate = useNavigate();
  const { role, role_loading } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const limit = 10;

  useEffect(() => {
    document.title = 'Emergency Donation Requests | LifeDrop';
  }, []);

  const { data: emergencyData = {}, isLoading, refetch } = useQuery({
    queryKey: ['emergency-requests', currentPage, limit],
    queryFn: async () => {
      const res = await axiosSecure.get('/user-requests/emergency-request', {
        params: { page: currentPage, limit }
      });
      return res.data;
    }
  });
  // console.log(emergencyData);

  const { emergencyRequests = [], total = 0 } = emergencyData;
  const totalPages = Math.ceil(total / limit) || 1;

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
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
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
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

  const handleEmergencyUpdate = async (id, newStatus) => {
    const statusMessages = {
      done: {
        title: 'Mark as Done?',
        text: 'This will complete the request.',
        icon: 'question',
        success: 'Request marked as done.'
      },
      acceptEmergency: {
        title: 'Accept Request?',
        text: 'This will mark the request as emergency.',
        icon: 'question',
        success: 'Request has been accepted.'
      },
      cancelEmergency: {
        title: 'Remove Emergency request?',
        text: 'This will remove the emergency request.',
        icon: 'warning',
        success: 'Emergency request removed.'
      }
    };
    // console.log(id, newStatus);

    const confirm = await Swal.fire({
      title: statusMessages[newStatus].title,
      text: statusMessages[newStatus].text,
      icon: statusMessages[newStatus].icon,
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#D32F2F',
      confirmButtonText: `Yes, ${newStatus === 'acceptEmergency' ? 'accept emergency' : newStatus === 'cancelEmergency' ? 'cancel it' : ''}`,
      customClass: {
        confirmButton: 'dark:bg-[#F8FAFC]',
        cancelButton: 'dark:bg-[#EF5350]'
      }
    });

    if (confirm.isConfirmed) {
      try {
        setActionLoading(true);
        const payload = newStatus === 'cancelEmergency'
          ? { emergencyRequest: false, status: 'cancel' }
          : { emergencyRequest: false, status: 'accept' };

        // console.log(payload);
        const res = await axiosSecure.patch(`/emergency/donation-requests/${id}`, payload);
        // console.log(res);
        if (res.data.modifiedCount) {
          Swal.fire('Success!', statusMessages[newStatus].success, 'success');
          refetch();
        }
      } catch (err) {
        console.error(`Error updating status to ${newStatus}`, err);
        Swal.fire('Error', 'Something went wrong.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const parentVariants = {
    initial: { scale: 0.75, opacity: 0, filter: 'blur(20px)' },
    animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  const menuVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2, ease: 'easeInOut' }
  };

  const loaderVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  return (
    <motion.div
      variants={parentVariants}
      initial="initial"
      animate="animate"
      transition="transition"
      className="p-4 dark:text-white min-h-screen"
    >
      <h2 className="text-2xl font-semibold mb-4 text-[#111827] dark:text-[#F8FAFC]">
        Emergency Donation Requests
      </h2>

      <div className="overflow-x-auto overflow-y-visible">
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
          <table className="table h-full w-full border-separate border-spacing-0 dark:text-white">
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
              {emergencyRequests.length > 0 ? (
                emergencyRequests.map((request, index) => (
                  <tr key={request._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="text-center">{(currentPage - 1) * limit + index + 1}</td>
                    <td>{request.recipientName}</td>
                    <td>{`${request.district}, ${request.division}`}</td>
                    <td className="text-center">{request.donationDate}</td>
                    <td className="text-center">{fnHandleTime(request.donationTime)}</td>
                    <td className="text-center">{request.bloodGroup || '--'}</td>
                    <td className="text-center">
                      <span className={`badge ${request.status === 'done'
                        ? 'badge-success'
                        : request.status === 'pending'
                          ? 'badge-warning'
                          : request.status === 'in_progress'
                            ? 'badge-info'
                            : 'badge-error'
                        }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === 'in_progress' || request.status === 'done'
                        ? `${request.donor_name} (${request.donor_email || '--'}) (${request.donor_number || '--'})`
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
                            className="absolute -bottom-[100%] right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-30 border border-[#E5E7EB] dark:border-[#334155]"
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
                              {(request.status === 'in_progress' || request.status === 'pending') && (
                                <button
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-500 hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                  onClick={() => {
                                    handleEmergencyUpdate(request._id, 'acceptEmergency');
                                    toggleMenu(null);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <FcAcceptDatabase /> Accept Request
                                </button>
                              )}
                              {(request.status === 'pending' || request.status === 'in_progress') && (
                                <button
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#D32F2F] dark:text-[#EF5350] hover:bg-[#F1F5F9] dark:hover:bg-[#475569]"
                                  onClick={() => {
                                    handleEmergencyUpdate(request._id, 'cancelEmergency');
                                    toggleMenu(null);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <FaTimes /> Cancel Emergency
                                </button>
                              )}
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
                    No emergency donation requests found.
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
            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
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
              <h3 className="text-xl font-bold mb-4 text-[#111827] dark:text-[#F8FAFC]">Emergency Request Details</h3>
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
                <p>
                  <strong>{selectedRequest.status === 'done' ? 'Donated By:' : 'Donor Info:'}</strong>
                  {selectedRequest.donor_name} ({selectedRequest.donor_email || '--'}) ({selectedRequest.donor_number || '--'})
                </p>
              )}
              {(selectedRequest.status === 'done' || selectedRequest.status === 'canceled') && (
                <p>
                  <strong>{selectedRequest.status === 'done' ? 'Donated' : 'Canceled'}</strong>
                  at {selectedRequest.status === 'done' ? formatDateTimeSimple(selectedRequest.donated_at) : formatDateTimeSimple(selectedRequest.canceled_at)}
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

export default EmergencyRequestsAdmin;