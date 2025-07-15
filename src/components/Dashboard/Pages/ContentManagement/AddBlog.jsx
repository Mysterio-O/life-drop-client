import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FaSpinner } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { motion } from 'motion/react';

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const title = e.target.title.value;
        const content = e.target.content.value;

        try {
            // First upload the thumbnail to ImageBB
            const formData = new FormData();
            formData.append('image', thumbnail);

            const imageUpload = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`,
                formData
            );

            const thumbnailUrl = imageUpload.data.data.url;
            const blogData = {
                title,
                thumbnail: thumbnailUrl,
                content,
                created_by: user.email
            };

            // Then save the blog with all data
            const res = await axiosSecure.post('https://life-drop-server.vercel.app/create-blog', blogData);
            if (res.data.result.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Blog created successfully.',
                    confirmButtonColor: '#111827',
                    customClass: { confirmButton: 'dark:bg-[#F8FAFC]' },
                });
                navigate('/dashboard/content-management');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create blog. Please try again.',
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen p-4 dark:text-white"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#111827] dark:text-[#F8FAFC]">
                Add New Blog
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
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Thumbnail Image</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            className="file-input file-input-bordered w-full bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Content</span>
                        </label>
                        <JoditEditor
                            name="content"
                            ref={editor}
                            config={config}
                            className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
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
                            Create Blog
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default AddBlog;