import React from 'react';
import { Link } from 'react-router';
import { FaPlus } from 'react-icons/fa';

const ContentManagement = () => {
    return (
        <div className="p-4 dark:text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Content Management</h2>
                <Link 
                    to="/dashboard/content-management/add-blog"
                    className="btn btn-primary"
                >
                    <FaPlus className="mr-2" />
                    Add Blog
                </Link>
            </div>
            
            {/* Blog list will go here */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No blogs available. Create your first blog!
                </p>
            </div>
        </div>
    );
};

export default ContentManagement;