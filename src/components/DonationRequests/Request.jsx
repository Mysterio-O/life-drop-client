import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'motion/react';
import { IoIosDoneAll } from 'react-icons/io';
import { FaUser, FaHospital, FaMapMarkerAlt, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import { IoIosArrowRoundBack } from "react-icons/io";
import useUserStatus from '../../hooks/useUserStatus';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Request = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const { status } = useUserStatus();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const { data: donationRequest = {}, isLoading } = useQuery({
    queryKey: ['donation-request', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosPublic.get(`donation-request/${id}`);
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
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Donation confirmed.',
        timer: 1500,
        showConfirmButton: false
      });
      setShowModal(false);
      queryClient.invalidateQueries(['donation-request', id]);
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong.',
        confirmButtonColor: '#D32F2F'
      });
    },
  });

  useEffect(() => {
    document.title = 'Donation Details | LifeDrop';
  }, []);

  const fnHandleTime = (time) => {
    if (!time) return '--';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleDonate = () => {
    if (!user) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in to donate.',
        icon: 'warning',
        confirmButtonText: 'Go to Sign In',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#D32F2F',
        customClass: {
          confirmButton: 'dark:bg-[#EF5350]',
          cancelButton: 'dark:bg-gray-700'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-white dark:bg-[#0F172A]">
        <div className="skeleton h-12 w-3/4 mb-8 max-w-md dark:bg-gray-700"></div>
        <div className="max-w-3xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-6 sm:p-8 rounded-xl shadow-md space-y-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="skeleton h-8 w-full dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-[#0F172A] overflow-x-hidden"
    >
      <motion.h2
      initial={{opacity:0,y:-10}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.5, ease:"easeInOut"}}
      className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-[#111827] dark:text-[#F8FAFC]">
        Donation Request Details
      </motion.h2>
      <motion.article
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="max-w-3xl w-full bg-[#F9FAFB] dark:bg-[#1E293B] p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
        aria-labelledby="donation-details-heading"
      >
        <section className="space-y-6">
          <motion.span
          title='Back to donations'
            onClick={() => navigate(-1)}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className='flex gap-1 items-center text-[#111827] dark:text-[#F8FAFC] text-xl font-bold cursor-pointer'>
            <IoIosArrowRoundBack size={30} /> Back
          </motion.span>
          {/* Requester Info */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: 60 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
              <FaUser className="text-[#D32F2F] dark:text-[#EF5350]" /> Requester Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#4B5563] dark:text-[#94A3B8]">
              <p><strong>Name:</strong> {donationRequest.requesterName || '--'}</p>
              <p><strong>Email:</strong> {donationRequest.requesterEmail || '--'}</p>
              <p className="sm:col-span-2">
                <strong>Status:</strong>
                <span className={`badge ml-2 ${donationRequest.status === 'done'
                  ? 'badge-success'
                  : donationRequest.status === 'pending'
                    ? 'badge-warning'
                    : donationRequest.status === 'in_progress'
                      ? 'badge-info'
                      : 'badge-error'}`}>
                  {donationRequest.status || '--'}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Recipient Info */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: -60 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
              <FaUser className="text-[#D32F2F] dark:text-[#EF5350]" /> Recipient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#4B5563] dark:text-[#94A3B8]">
              <p><strong>Name:</strong> {donationRequest.recipientName || '--'}</p>
              <p><strong>Number:</strong> {donationRequest.recipientNumber || '--'}</p>
            </div>
          </motion.div>

          {/* Location Info */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: 60 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-[#D32F2F] dark:text-[#EF5350]" /> Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[#4B5563] dark:text-[#94A3B8]">
              <p><strong>Division:</strong> {donationRequest.division || '--'}</p>
              <p><strong>District:</strong> {donationRequest.district || '--'}</p>
              <p><strong>Upazila:</strong> {donationRequest.upazila || '--'}</p>
              <p className="sm:col-span-3"><strong>Address:</strong> {donationRequest.address || '--'}</p>
              <p className="sm:col-span-3"><strong>Hospital:</strong> {donationRequest.hospitalName || '--'}</p>
            </div>
          </motion.div>

          {/* Donation Details */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, x: -60 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.7 }}
          >
            <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2 mb-3">
              <FaCalendar className="text-[#D32F2F] dark:text-[#EF5350]" /> Donation Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#4B5563] dark:text-[#94A3B8]">
              <p><strong>Blood Group:</strong> {donationRequest.bloodGroup || '--'}</p>
              <p><strong>Date:</strong> {donationRequest.donationDate || '--'}</p>
              <p><strong>Time:</strong> {fnHandleTime(donationRequest.donationTime)}</p>
              <p className="sm:col-span-2"><strong>Message:</strong> {donationRequest.requestMessage || '--'}</p>
              <p className="sm:col-span-2"><strong>Created At:</strong> {new Date(donationRequest.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) || '--'}</p>
            </div>
          </motion.div>

          {/* Blocked User Warning */}
          {status === 'blocked' && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-[#D32F2F] dark:border-[#EF5350] p-4 rounded-md flex items-center gap-2">
              <FaExclamationTriangle className="text-[#D32F2F] dark:text-[#EF5350]" />
              <p className="text-[#D32F2F] dark:text-[#EF5350] font-semibold">
                Your account is blocked. Please contact an admin to donate.
              </p>
            </div>
          )}

          {/* Donate Button */}
          {donationRequest.status === 'pending' && status !== 'blocked' && (
            <div className="flex justify-center mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDonate}
                className="btn btn-lg bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] transition-colors px-8"
                aria-label="Donate blood for this request"
              >
                <IoIosDoneAll className="mr-2" /> Donate
              </motion.button>
            </div>
          )}
        </section>
      </motion.article>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirm-donation-heading"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-[#F9FAFB] dark:bg-[#1E293B] p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="confirm-donation-heading" className="text-xl sm:text-2xl font-bold mb-4 text-center text-[#111827] dark:text-[#F8FAFC]">
                Confirm Donation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Name</label>
                  <input
                    type="text"
                    readOnly
                    value={user?.displayName || '--'}
                    className="input input-bordered w-full bg-gray-100 dark:bg-[#334155] text-[#4B5563] dark:text-[#94A3B8]"
                    aria-readonly="true"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Email</label>
                  <input
                    type="email"
                    readOnly
                    value={user?.email || '--'}
                    className="input input-bordered w-full bg-gray-100 dark:bg-[#334155] text-[#4B5563] dark:text-[#94A3B8]"
                    aria-readonly="true"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111827] dark:text-[#F8FAFC] mb-1">Donor Mobile (optional)</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="input input-bordered w-full bg-white dark:bg-[#1E293B] text-[#111827] dark:text-[#F8FAFC]"
                    placeholder="Enter mobile number"
                    aria-label="Donor mobile number"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline text-[#D32F2F] dark:text-[#EF5350] hover:bg-gray-100 dark:hover:bg-[#475569] px-6"
                  aria-label="Cancel donation confirmation"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDonation}
                  disabled={isPending}
                  className="btn bg-[#D32F2F] dark:bg-[#EF5350] text-white hover:bg-[#B71C1C] dark:hover:bg-[#F44336] px-6"
                  aria-label="Confirm donation"
                >
                  {isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>Confirm <IoIosDoneAll className="ml-2" /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Request;