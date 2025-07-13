import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { FaHeart, FaShareAlt } from 'react-icons/fa';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Blogs = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();

    // Added missing comments state
    const [comments, setComments] = useState({});

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['published-blogs'],
        queryFn: async () => {
            const res = await axiosPublic.get('/all-blogs-public');
            return res.data.blogs;
        }
    });

    const { mutate: addLike } = useMutation({
        mutationFn: async ({ blogId, email }) => {
            const like = { blogId, email };
            const res = await axiosSecure.patch('/like-blog', like);
            // console.log(res);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['published-blogs']);
            console.log(data);
            Swal.fire({
                icon: data.action === 'liked' ? 'success' : 'info',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                customClass: {
                    popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                    icon: 'text-[#D32F2F] text-xl',
                },
                html: data.action === 'liked' ? '<span>Liked!</span>' : '<span>Unliked!</span>',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                customClass: {
                    popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                    icon: 'text-[#D32F2F] text-xl',
                },
                html: '<span>Error!</span>',
            });
        }
    });

    const handleLike = (blogId, email) => {
        if (blogId && email) {
            addLike({ blogId, email });
        }
    };

    const handleComment = (blogId, e) => {
        e.preventDefault();
        const commentText = e.target.comment.value;
        if (commentText.trim()) {
            setComments((prev) => ({
                ...prev,
                [blogId]: [...(prev[blogId] || []), commentText],
            }));
            e.target.reset();
        }
    };

    const handleShare = (blogId) => {
        const blogUrl = window.location.origin + `/blog/${blogId}`;
        alert(`Share this blog: ${blogUrl}`);
    };

    if (isLoading || loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen p-4 dark:text-white"
            >
                <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md animate-pulse">
                            <div className="w-[45%] h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mr-4"></div>
                            <div className="w-[55%]">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
            className="min-h-screen p-4 dark:text-white mt-6"
        >
            <h2 className="text-3xl font-bold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                Our Blogs
            </h2>

            {blogs.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No published blogs available.
                </p>
            ) : (
                <div className="space-y-6">
                    {blogs.map((blog) => {
                        const isLikedByUser = blog.liked_by?.includes(user?.email);
                        const likeCount = blog.liked_by?.length || 0;

                        return (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-200 flex"
                            >
                                {/* Left Part: Thumbnail */}
                                <div className="w-[45%] mr-4">
                                    {blog.thumbnail && (
                                        <img
                                            src={blog.thumbnail}
                                            alt={blog.title}
                                            className="w-full h-full object-cover rounded-lg border-4 border-[#D32F2F]"
                                            style={{ height: '100%' }}
                                        />
                                    )}
                                </div>

                                {/* Right Part: Content and Actions */}
                                <div className="w-[55%]">
                                    <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] mb-2">
                                        {blog.title}
                                    </h3>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none mb-4"
                                        dangerouslySetInnerHTML={{ __html: blog.content }}
                                        style={{
                                            img: { maxWidth: '100%', height: 'auto', margin: '1rem 0' },
                                            h1: { fontSize: '1.5rem', margin: '1rem 0', color: '#111827' },
                                            p: { margin: '0.5rem 0', color: '#374151' },
                                        }}
                                    />
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span>By: {blog.created_by}</span>
                                        <span className="ml-4">Date: {new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {/* Like Button */}
                                        <button
                                            onClick={() => handleLike(blog._id, user.email)}
                                            className={`flex items-center space-x-2 ${isLikedByUser ? 'text-[#D32F2F]' : 'text-gray-500 dark:text-gray-400'}`}
                                        >
                                            <motion.span
                                                initial={{ scale: 1 }}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <FaHeart size={30} className='hover:text-[#D32F2F] transition-colors duration-300' />
                                            </motion.span>
                                            <span className='text-lg'>{likeCount} Likes</span>
                                        </button>

                                        {/* Comment Input and Button */}
                                        <form onSubmit={(e) => handleComment(blog._id, e)} className="flex space-x-2">
                                            <input
                                                type="text"
                                                name="comment"
                                                placeholder="Write a comment..."
                                                className="input input-bordered w-48 bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                                            />
                                            <button
                                                type="submit"
                                                className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                                            >
                                                Comment
                                            </button>
                                        </form>

                                        {/* Share Button */}
                                        <button
                                            onClick={() => handleShare(blog._id)}
                                            className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                                        >
                                            <FaShareAlt />
                                        </button>
                                    </div>
                                    {comments[blog._id] && (
                                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                            <h4 className="font-semibold">Comments:</h4>
                                            <ul>
                                                {comments[blog._id].map((comment, index) => (
                                                    <li key={index} className="ml-4">{comment}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default Blogs;