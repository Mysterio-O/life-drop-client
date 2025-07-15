import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import DonationRequestLayout from './Overviews/shared/DonationRequestLayout';
import useUserRole from '../../../hooks/useUserRole';

const AllDonations = () => {

    const { role, role_loading } = useUserRole();
    console.log(role);

    const limit = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState("all");
    const [allowDelete, setAllowDelete] = useState(true);

    const [isUser]=useState(false)

    useEffect(() => {
        if (role === 'volunteer') {
            setAllowDelete(false)
        }
    }, [role]);

    useEffect(()=> {
        document.title = "All Requests"
    },[])

    const { data: donationRequests = [], isLoading, refetch } = useQuery({
        queryKey: ['all-blood-donation-request', limit, currentPage, statusFilter],
        queryFn: async () => {
            const statusQuery = statusFilter === "all" ? "all" : `${statusFilter}`;
            const res = await axiosSecure.get('/all-blood-donation-request', {
                params: {
                    page: currentPage, limit, status: statusQuery
                }
            });
            return res.data;
        }
    });

    // console.log(donationRequests);
    // console.log(statusFilter);

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

    const handleStatusUpdate = async (id, newStatus, donor_email) => {
        const statusMessages = {
            done: {
                title: "Mark as Done?",
                text: "This will complete the request.",
                icon: "question",
                success: "Request marked as done."
            },
            canceled: {
                title: "Cancel Request?",
                text: "This will mark the request as canceled but keep it in your history.",
                icon: "warning",
                success: "Request has been canceled."
            }
        };

        const confirm = await Swal.fire({
            title: statusMessages[newStatus].title,
            text: statusMessages[newStatus].text,
            icon: statusMessages[newStatus].icon,
            showCancelButton: true,
            confirmButtonText: `Yes, ${newStatus === 'done' ? 'mark done' : 'cancel it'}`,
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/donation-requests/${id}`, { status: newStatus, donorEmail: donor_email });
                if (res.data.result.modifiedCount) {
                    Swal.fire("Success!", statusMessages[newStatus].success, "success");
                    refetch();
                }
            } catch (err) {
                console.log(`error updating status to ${newStatus}`, err);
                Swal.fire("Error", "Something went wrong.", "error");
            }
        }
    };

    const title = 'All Donation Requests'

    return (
        <>
            <DonationRequestLayout statusFilter={statusFilter} handleStatusChange={handleStatusChange} isLoading={isLoading} donationRequests={donationRequests} currentPage={currentPage} limit={limit} handleDelete={handleDelete} handleStatusUpdate={handleStatusUpdate} setCurrentPage={setCurrentPage} totalPages={totalPages} title={title} role_loading={role_loading} allowDelete={allowDelete} isUser={isUser} />
        </>
    );
};

export default AllDonations;