import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineUnpublished, MdPublishedWithChanges } from 'react-icons/md';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useUserRole from '../../../../hooks/useUserRole';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'motion/react';

const ContentManagement = () => {
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [filter, setFilter] = useState('all');

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['all-blogs', filter],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-blogs', {
                params: {
                    status: filter === 'all' ? undefined : filter,
                    page,
                    limit
                }
            });
            return res.data.blogs;
        }
    });
    // console.log(blogs);

    useEffect(()=> {
        document.title = "Content Management";
    },[])

    // Mutation for publishing/unpublishing a blog
    const { mutate: togglePublishStatus } = useMutation({
        mutationFn: async ({ blogId, currentStatus }) => {
            const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
            const res = await axiosSecure.patch(`/blogs/${blogId}/status`, { status: newStatus });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['all-blogs']);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Blog status updated successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    });

    // Mutation for deleting a blog
    const { mutate: deleteBlog } = useMutation({
        mutationFn: async (blogId) => {
            const res = await axiosSecure.delete(`/blogs/${blogId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['all-blogs']);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Blog deleted successfully",
                showConfirmButton: false,
                timer: 1500
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    });

    const handlePublishToggle = (blogId, currentStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to ${currentStatus === 'draft' ? 'publish' : 'unpublish'} this blog`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${currentStatus === 'draft' ? 'publish' : 'unpublish'} it!`
        }).then((result) => {
            if (result.isConfirmed) {
                togglePublishStatus({ blogId, currentStatus });
            }
        });
    };

    const handleDelete = (blogId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBlog(blogId);
            }
        });
    };

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4"
            >
                <div className="grid grid-cols-1 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-48 flex-shrink-0">
                                    <Skeleton height={128} width={192} className="rounded-lg" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Skeleton height={24} width={200} className="mb-2" />
                                            <div className="flex flex-wrap gap-2 mt-1 text-sm">
                                                <Skeleton height={24} width={80} className="rounded-full" />
                                                <Skeleton height={16} width={120} className="ml-2" />
                                                <Skeleton height={16} width={100} className="ml-2" />
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {[...Array(3)].map((_, j) => (
                                                <Skeleton key={j} height={32} width={32} circle={true} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Skeleton height={16} count={2} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 dark:text-white"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#111827] dark:text-[#F8FAFC]">
                    Content Management
                </h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/dashboard/content-management/add-blog"
                        className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                    >
                        <FaPlus className="mr-2" />
                        Add Blog
                    </Link>
                </motion.div>
            </div>

            {/* Filter dropdown */}
            <div className="mb-4">
                <label htmlFor="blog-filter" className="mr-2 text-[#111827] dark:text-[#F8FAFC]">
                    Filter by status:
                </label>
                <select
                    id="blog-filter"
                    className="select select-bordered bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Blogs</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            {/* Blog list */}
            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4"
            >
                {blogs.length < 1 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No blogs available. Create your first blog!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Thumbnail */}
                                    {blog.thumbnail && (
                                        <div className="w-full md:w-48 flex-shrink-0">
                                            <img
                                                src={blog.thumbnail}
                                                alt={blog.title}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    {/* Blog Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC]">
                                                    {blog.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className={`px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                        {blog.status}
                                                    </span>
                                                    <span>Created by: {blog.created_by}</span>
                                                    <span>Created: {new Date(blog.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                {/* Edit button */}
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Link
                                                        to={`/dashboard/content-management/edit-blog/${blog._id}`}
                                                        className="btn btn-sm btn-outline text-[#D32F2F] dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                </motion.div>

                                                {/* Publish/Unpublish button - only for admin */}
                                                {role === 'admin' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handlePublishToggle(blog._id, blog.status)}
                                                        className={`btn btn-sm ${blog.status === 'draft' ? 'btn-success' : 'btn-warning'}`}
                                                        title={blog.status === 'draft' ? 'Publish' : 'Unpublish'}
                                                    >
                                                        {blog.status === 'draft' ? <MdPublishedWithChanges /> : <MdOutlineUnpublished />}
                                                    </motion.button>
                                                )}

                                                {/* Delete button - only for admin */}
                                                {role === 'admin' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="btn btn-sm btn-error text-[#D32F2F] dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </motion.button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content preview - show first 100 characters */}
                                        <div className="mt-2 text-gray-700 dark:text-gray-300">
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: blog.content.length > 100
                                                        ? `${blog.content.substring(0, 100)}...`
                                                        : blog.content
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Pagination - optional */}
            {blogs.length > 0 && (
                <div className="flex justify-center mt-4">
                    <div className="btn-group">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn text-[#111827] dark:text-[#F8FAFC]"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </motion.button>
                        <button className="btn text-[#111827] dark:text-[#F8FAFC] dark:bg-gray-800">Page {page}</button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn text-[#111827] dark:text-[#F8FAFC]"
                            onClick={() => setPage(p => p + 1)}
                            disabled={blogs.length < limit}
                        >
                            Next
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ContentManagement;