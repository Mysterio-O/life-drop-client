import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const OverviewCharts = () => {

    const [done, setDone] = useState(0);
    const [inProgress, setInProgress] = useState(0);
    const [canceled, setCanceled] = useState(0);

    const [active, setActive] = useState(0);
    const [blocked, setBlocked] = useState(0);

    const axiosSecure = useAxiosSecure();

    const { data: donationStatus = [], isLoading: doantionLoading } = useQuery({
        queryKey: ['donation-status'],
        queryFn: async () => {
            const res = await axiosSecure.get('/donation-status-distribution');
            return res.data
        }
    });
    // console.log(donationStatus)

    const { data: users = [], isLoading: userLoading } = useQuery({
        queryKey: ['user-status'],
        queryFn: async () => {
            const res = await axiosSecure.get('/user-status-distribution');
            return res.data;
        }
    })
    // console.log(users);






    useEffect(() => {
        donationStatus.map(status => {
            // console.log(status);
            if (status.name === 'done') {
                setDone(status.value || 0)
            } else if (status.name === 'in_progress') {
                setInProgress(status.value || 0);
            }
            else if (status.name === 'canceled') {
                setCanceled(status.value || 0);
            }
        });

        users.map(user => {
            if (user.status === 'active') {
                setActive(user.value);
            }
            if (user.status === 'blocked') {
                setBlocked(user.value);
            }
        })
    });

    if (doantionLoading || userLoading) {
        return '...loading'
    }

    // console.log(done, inProgress, canceled);



    const barData = [
        { name: 'Done', value: done },
        { name: 'In Progress', value: inProgress },
        { name: 'Canceled', value: canceled },
    ];

    const lineData = [
        { week: 'Week 1', count: 5 },
        { week: 'Week 2', count: 7 },
        { week: 'Week 3', count: 10 },
        { week: 'Week 4', count: 12 },
    ];

    const pieData = [
        { name: 'Active Users', value: active },
        { name: 'Blocked Users', value: blocked },
    ];

    const colors = ['#7E22CE', '#facc15', '#f87171'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-6">
            {/* Bar Chart - donation status distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Donation status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="value" fill="#7E22CE" barSize={30} radius={[10, 10, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart - My Plants Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Completed Donations Ratio
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="week" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#facc15"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart - User Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    User Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OverviewCharts;