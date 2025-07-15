import React, { useState } from 'react';
import { TbWorldSearch } from 'react-icons/tb';
import 'react-circular-progressbar/dist/styles.css';
import OverviewCard from './OverviewCard';
import { FaHeart, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';
import OverviewCharts from './OverviewCharts';
import useAuth from '../../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useUserRole from '../../../../hooks/useUserRole';

const AdminOverview = () => {
    const [searchText, setSearchText] = useState('');

    const [funding, setFunding] = useState(10);
    const axiosSecure = useAxiosSecure();
    const { role } = useUserRole();

    const { user, loading } = useAuth();
    const { email } = user;

    const { data: users = 0, isLoading: userLoading } = useQuery({
        queryKey: ['users-count'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-users-count');
            return res.data;
        }
    });

    const { data: requests = 0, isLoading: requestLoading } = useQuery({
        queryKey: ['donation-request'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-donation-request');
            return res.data;
        }
    });

    const { data: fundingAmount = 0, isLoading: fundLoading } = useQuery({
        queryKey: ['all-funding'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-funding');
            return res.data.totalAmount;
        }
    })

    console.log(requests);

    const cardData = [
        {
            title: 'Total Donation Requests',
            value: requests,
            progress: requests * 500 / 100,
            color: '#7E22CE', // purple
            change: '+14% Inc',
            changeColor: '#7E22CE',
            Icon: FaHeart,
            iconColor: 'text-[#7E22CE]',
            to: '/dashboard/all-blood-donation-request'
        },
        {
            title: 'Total Funding',
            value: fundingAmount,
            progress: fundingAmount * 50 / 100,
            color: '#facc15', // yellow
            change: '+06% Inc',
            changeColor: '#eab308',
            Icon: FaHandHoldingHeart,
            iconColor: 'text-[#facc15]',
            to: '/dashboard/all-funding'
        },
        {
            title: 'Total Users',
            value: users,
            progress: users * 50 / 100,
            color: '#f87171', // red
            change: '+04% Dec',
            changeColor: '#f87171',
            Icon: FaUsers,
            iconColor: 'text-[#f87171]',
            ...(role === 'admin' && { to: '/dashboard/all-users' })
        }
    ];

    if (loading || userLoading || requestLoading) {
        return (
            <div className="transition-colors duration-300 p-4">
                <header className="flex justify-between items-center gap-4 md:pt-16 mb-8">
                    <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="flex items-center bg-[#eef0fc] rounded-full px-2 py-1 w-40 md:w-64">
                        <div className="h-8 w-full bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"></div>
                        <div className="h-8 w-10 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-xl ml-1"></div>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-40 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                    ))}
                </div>
                <div className="mt-6 h-64 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="transition-colors duration-300">
            {/* header part */}
            <header className="flex justify-between items-center gap-4 md:pt-16 mb-8">
                <h2 className="text-3xl font-semibold text-center text-[#111827] dark:text-[#F8FAFC]">
                    Welcome Back {user.displayName}!
                </h2>
                <form className="flex items-center bg-[#eef0fc] rounded-full px-2 py-1 focus-within:ring-2 focus-within:ring-purple-600">
                    <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="bg-transparent focus:outline-none px-4 py-2 text-sm text-gray-700 placeholder-gray-500 w-40 md:w-64"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-2 ml-1"
                    >
                        <TbWorldSearch size={20} />
                    </button>
                </form>
            </header>

            {/* card stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardData.map((card, idx) => (
                    <OverviewCard key={idx} card={card} idx={idx} />
                ))}
            </div>

            <div>
                <OverviewCharts />
            </div>
        </div>
    );
};

export default AdminOverview;