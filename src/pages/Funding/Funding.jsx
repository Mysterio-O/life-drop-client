import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const Funding = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { data: fundingData = {}, isLoading } = useQuery({
        queryKey: ['funding', page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/funding?page=${page}&limit=${itemsPerPage}`);
            return res.data || {};
        },
    });



useEffect(()=> {
    document.title = 'Fundings'
},[])

    const totalItems = fundingData.count;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-12 mb-6 rounded-lg"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 animate-pulse h-40 rounded-lg mb-6"></div>
                    {[...Array(5)].map((_, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gray-300 dark:bg-gray-700 animate-pulse h-10 rounded-lg mb-2"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0F172A] p-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => navigate('/give-funding')}
                        className="px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors"
                    >
                        Give Fund
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#F9FAFB] dark:bg-[#1E293B] rounded-lg shadow-md p-4"
                >
                    <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F8FAFC] mb-4">
                        Funding History
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-[#111827] dark:text-[#F8FAFC]">
                            <thead className="text-xs uppercase bg-[#D32F2F] text-white dark:bg-[#EF5350]">
                                <tr>
                                    <th className="px-4 py-2">Donor</th>
                                    <th className="px-4 py-2">Amount (USD)</th>
                                    <th className="px-4 py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fundingData.data.map((funding) => (
                                    <tr key={funding._id} className="border-b border-[#E5E7EB] dark:border-[#334155]">
                                        <td className="px-4 py-2">{funding.donated_by}</td>
                                        <td className="px-4 py-2">{funding.amount}</td>
                                        <td className="px-4 py-2">
                                            {new Date(funding.donated_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <div className="mt-4 flex justify-center space-x-2">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors disabled:opacity-50"
                    >
                        Previous
                    </motion.button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                        <motion.button
                            key={num}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 + (num - 1) * 0.1 }}
                            onClick={() => setPage(num)}
                            className={`px-4 py-2 rounded-md ${page === num
                                ? 'bg-[#D32F2F] text-white dark:bg-[#EF5350]'
                                : 'bg-[#F9FAFB] text-[#111827] dark:bg-[#1E293B] dark:text-[#F8FAFC] hover:bg-[#E0E7FF] dark:hover:bg-[#334155]'
                                } transition-colors`}
                        >
                            {num}
                        </motion.button>
                    ))}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] dark:bg-[#EF5350] dark:hover:bg-[#F44336] transition-colors disabled:opacity-50"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Funding;