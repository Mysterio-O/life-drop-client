import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FaSpinner } from 'react-icons/fa';
import JoditEditor from 'jodit-react';
import useAuth from '../../../../hooks/useAuth';

const AddBlog = () => {
    const [title, setTitle] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    // const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const editor = useRef(null);

    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const title = e.target.title.value;
        const content = e.target.content.value;
        console.log(thumbnail, content, title);

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
            const res = await axios.post('http://localhost:3000/create-blog', {
                blogData
            });
            if (res.result.insertedId) {
                console.log(res.message, res.result);
                navigate('/dashboard/content-management');
            }
            console.log(res);

        } catch (error) {
            console.error('Error creating blog:', error);
            alert('Failed to create blog');
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
    // console.log(content)

    return (
        <div className="p-4 dark:text-white">
            <h2 className="text-2xl font-semibold mb-6">Add New Blog</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full dark:text-black"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Thumbnail Image</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                        className="file-input file-input-bordered w-full"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Content</span>
                    </label>
                    <JoditEditor
                        name='content'
                        ref={editor}
                        // value={content}
                        config={config}
                        // onChange={newContent => setContent(newContent)}
                        className="border rounded-lg overflow-hidden dark:text-black"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin mr-2" />
                        ) : null}
                        Create Blog
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBlog;