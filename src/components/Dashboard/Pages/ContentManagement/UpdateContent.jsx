import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { FaSpinner } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';

const UpdateContent = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: blog = {}, isLoading: blogLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            const res = await axiosSecure.get('/blog', {
                params: { id }
            });
            return res.data.blog;
        }
    });

    useEffect(() => {
        if (!blogLoading && blog) {
            setTitle(blog.title || '');
            setContent(blog.content || '');
            // Thumbnail is not pre-filled in state as it can be updated separately
        }
    }, [blog, blogLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let thumbnailUrl = blog.thumbnail; // Keep existing thumbnail if no new one is uploaded
        try {
            // Upload new thumbnail if provided
            if (thumbnail) {
                const formData = new FormData();
                formData.append('image', thumbnail);

                const imageUpload = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
                    formData
                );
                thumbnailUrl = imageUpload.data.data.url;
            }

            const blogData = {
                title,
                thumbnail: thumbnailUrl,
                content,
                updated_by: user.email
            };

            // Update the blog
            const res = await axiosSecure.patch(`/blog/${id}`, blogData);
            // console.log(res);
            if (res.data.result.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Blog updated successfully.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
                navigate('/dashboard/content-management');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update blog. Please try again.',
                confirmButtonColor: '#D32F2F',
                customClass: { confirmButton: 'dark:bg-[#EF5350]' },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const config = {
        readonly: false,
        height: '500px',
        toolbarAdaptive: false,
        toolbarButtonSize: 'medium',
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
    };

    if (blogLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen p-4 dark:text-white"
            >
                <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded ml-auto"></div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen p-4 dark:text-white"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                Update Blog
            </h2>

            <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 space-y-4"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Title</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input input-bordered w-full bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Thumbnail Image (Leave empty to keep current)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            className="file-input file-input-bordered w-full bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                        {blog.thumbnail && (
                            <div className="mt-2">
                                <img src={blog.thumbnail} alt="Current Thumbnail" className="w-32 h-32 object-cover rounded-lg" />
                            </div>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Content</span>
                        </label>
                        <JoditEditor
                            name="content"
                            ref={editor}
                            value={content}
                            onChange={newContent => setContent(newContent)}
                            config={config}
                            className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 text-[#111827]  focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        />
                    </div>

                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="btn bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <FaSpinner className="animate-spin mr-2" />
                            ) : null}
                            Update Blog
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UpdateContent;