import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

const statusOptions = ["all", "pending", "in_progress", "done", "canceled"];

const MyDonationRequest = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const { data: donationRequests = [], refetch, isLoading } = useQuery({
        queryKey: ["my-donation-requests", user?.email, statusFilter, currentPage],
        queryFn: async () => {
            const statusQuery = statusFilter === "all" ? "" : `&status=${statusFilter}`;
            const res = await axiosSecure.get(
                `/donation-requests?email=${user?.email}${statusQuery}&page=${currentPage}&limit=${limit}`
            );
            return res.data;
        },
        enabled: !!user?.email,
    });

    const totalPages = donationRequests?.totalPages || 1;

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

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

    const handleMarkDone = async (id) => {
        const confirm = await Swal.fire({
            title: "Mark as Done?",
            text: "This will complete the request.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, mark done",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/donation-requests/${id}`, { status: 'done' });
                if (res.data.result.modifiedCount) {
                    Swal.fire("Success!", "Request marked as done.", "success");
                    refetch();
                }

            } catch (err) {
                console.log('error updating status', err);
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

        // Convert hour to 12-hour format
        hour = hour % 12 || 12;

        const formattedTime = `${hour}:${minute} ${ampm}`;
        return formattedTime;
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">My Donation Requests</h2>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <label className="text-sm font-medium">
                    Filter by Status:
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="select select-bordered ml-2"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Recipient</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donationRequests?.requests?.length > 0 ? (
                                donationRequests.requests.map((request, index) => (
                                    <tr key={request._id}>
                                        <td>{(currentPage - 1) * limit + index + 1}</td>
                                        <td>{request.recipientName}</td>
                                        <td>{request.district}, {request.division}</td>
                                        <td>{request.donationDate}</td>
                                        <td>
                                            <span className={`badge ${request.status === "done"
                                                ? "badge-success"
                                                : request.status === "pending"
                                                    ? "badge-warning"
                                                    : request.status === "inprogress"
                                                        ? "badge-info"
                                                        : "badge-error"
                                                }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline btn-info"
                                                onClick={() => openModal(request)}
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </button>
                                            {(request.status === "pending" || request.status === "in_progress") && (
                                                <button
                                                    className="btn btn-sm btn-outline btn-error"
                                                    onClick={() => handleDelete(request._id)}
                                                    title="Cancel Request"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
                                            {request.status === "in_progress" && (
                                                <button
                                                    className="btn btn-sm btn-outline btn-success"
                                                    onClick={() => handleMarkDone(request._id)}
                                                    title="Mark as Done"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-400">
                                        No donation requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
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

            {/* Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-md w-full relative">
                        <h3 className="text-xl font-bold mb-4">Donation Request Details</h3>
                        <p><strong>Recipient:</strong> {selectedRequest.recipientName}</p>
                        <p><strong>Location:</strong> {selectedRequest.district}, {selectedRequest.division}</p>
                        <p><strong>Donation Date:</strong> {selectedRequest.donationDate}</p>
                        <p><strong>Donation Time:</strong> {fnHandleTime(selectedRequest.donationTime)}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                        <p><strong>Requester:</strong> {selectedRequest.requesterName} ({selectedRequest.requesterEmail})</p>
                        {/* You can include more fields if needed */}

                        <div className="mt-6 text-right">
                            <button
                                onClick={closeModal}
                                className="btn btn-sm btn-outline"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequest;
