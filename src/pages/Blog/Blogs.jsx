import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { FaHeart, FaShareAlt, FaTimes, FaCheckCircle } from 'react-icons/fa'; // Added FaCheckCircle for feedback
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import ProfilePicture from './ProfilePicture';

const Blogs = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();

    const { data: blogs = [], isLoading, refetch } = useQuery({
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
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['published-blogs']);
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


    useEffect(()=> {
        document.title = 'Blogs'
    },[])


    const handleComment = async (blogId, e) => {
        e.preventDefault();
        const form = e.target;
        const commentText = form.comment.value;
        if (!commentText || !blogId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please write a comment',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        } else {
            const commentBody = {
                email: user.email,
                comment: commentText
            };
            const res = await axiosSecure.patch(`/blog/${blogId}/add-comment/`, commentBody);
            if (res.data.result.modifiedCount > 0) {
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Comment added!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                refetch();
            }
        }
    };

    const handleShare = async (blogId, blogTitle) => {
        const blogUrl = `${window.location.origin}/blog/${blogId}`;
        const shareText = `Check out this blog post: ${blogTitle}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: blogTitle,
                    text: shareText,
                    url: blogUrl,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    openCustomShareDialog(blogUrl, blogTitle);
                }
            }
        } else {
            openCustomShareDialog(blogUrl, blogTitle);
        }
    };

    const openCustomShareDialog = (url, title) => {
        Swal.fire({
            title: 'Share this blog',
            html: `
            <div>
                <button id="facebook-share">Facebook</button>
                <button id="twitter-share">Twitter</button>
                <button id="linkedin-share">LinkedIn</button>
                <button id="email-share">Email</button>
                <button id="copy-link">Copy Link</button>
            </div>`,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: () => {
                document.getElementById('facebook-share').onclick = () => {
                    shareToSocial('facebook', url, title);
                    Swal.close();
                };
                document.getElementById('twitter-share').onclick = () => {
                    shareToSocial('twitter', url, title);
                    Swal.close();
                };
                document.getElementById('linkedin-share').onclick = () => {
                    shareToSocial('linkedin', url, title);
                    Swal.close();
                };
                document.getElementById('email-share').onclick = () => {
                    shareToSocial('email', url, title);
                    Swal.close();
                };
                document.getElementById('copy-link').onclick = () => {
                    copyToClipboard(url);
                    Swal.close();
                };
            }
        });
    };

    const shareToSocial = (platform, url, title) => {
        let shareUrl = '';
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodedTitle}&body=Check out this blog: ${encodedUrl}`;
                window.location.href = shareUrl;
                showSuccessToast('Email client opened!');
                return;
            default:
                return;
        }

        const popup = window.open(shareUrl, '_blank', 'width=600,height=400');
        if (popup) {
            showSuccessToast('Share window opened!');
        } else {
            showErrorToast('Popup blocked! Please allow popups.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => showSuccessToast('Link copied to clipboard!'))
            .catch(() => showErrorToast('Failed to copy link.'));
    };
    const showSuccessToast = (message) => {
        Swal.fire({
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                icon: 'text-green-500 text-xl',
            },
            html: `<span>${message}</span>`
        });
    };

    const showErrorToast = (message) => {
        Swal.fire({
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'bg-gray-800 text-white rounded-lg shadow-lg',
                icon: 'text-red-500 text-xl',
            },
            html: `<span>${message}</span>`
        });
    };


    const [selectedBlog, setSelectedBlog] = useState(null);

    const openModal = (blog) => setSelectedBlog(blog);
    const closeModal = () => setSelectedBlog(null);

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
            className="min-h-screen p-4 dark:text-white my-10"
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
                        const visibleComments = blog.comments?.slice(0, 3) || [];
                        const hasMoreComments = blog.comments?.length > 3;

                        return (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-200 flex flex-col md:flex-row"
                            >
                                {/* Left Part: Thumbnail */}
                                <div className="md:w-[45%] mr-4">
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
                                <div className="md:w-[55%]">
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
                                    {user && (
                                        <div className="flex flex-col lg:flex-row justify-between gap-4 lg:gap-0 lg:items-center">
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
                                                    <FaHeart size={30} className="hover:text-[#D32F2F] transition-colors duration-300" />
                                                </motion.span>
                                                <span className="text-lg">{likeCount} Likes</span>
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
                                    )}
                                    <div className="divider"></div>
                                    <h4 className="font-semibold">Comments:</h4>
                                    {blog.comments && blog.comments.length > 0 ? (
                                        <>
                                            <div className="space-y-3 divide-y p-2">
                                                {visibleComments.map((comment, idx) => (
                                                    <div className="flex gap-4 items-center" key={idx}>
                                                        <ProfilePicture email={comment.commented_by} />
                                                        <div>
                                                            <p className="text-lg font-medium text-balance dark:text-white">
                                                                {comment.comment}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(comment.created_at).toLocaleString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    hour12: true,
                                                                    timeZone: 'Asia/Dhaka',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {hasMoreComments && (
                                                <button
                                                    onClick={() => openModal(blog)}
                                                    className="btn btn-sm bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 mt-2"
                                                >
                                                    View More Comments
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Modal for All Comments */}
            <AnimatePresence>
                {selectedBlog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ y: 50, scale: 0.9 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 50, scale: 0.9 }}
                            className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-[#111827] dark:text-[#F8FAFC]">
                                    Comments for "{selectedBlog.title}"
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-[#D32F2F] hover:text-red-700 dark:hover:text-red-500 text-2xl"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="divide-y overflow-scroll overflow-y-auto overflow-x-hidden p-2">
                                {selectedBlog.comments?.map((comment, idx) => (
                                    <div className="flex gap-2 items-center" key={idx}>
                                        <ProfilePicture email={comment.commented_by} />
                                        <div>
                                            <p className="text-lg font-medium text-balance dark:text-white">
                                                {comment.comment}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(comment.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                    timeZone: 'Asia/Dhaka',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Blogs;