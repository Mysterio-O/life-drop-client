import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { motion } from 'motion/react';

const SearchDonor = () => {
    const axiosPublic = useAxiosPublic();

     useEffect(()=> {
            document.title = 'Search Donor'
        },[])

    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [upazilaName, setUpazilaName] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { handleSubmit, register } = useForm();

    useEffect(() => {
        fetch('/division.json').then(res => res.json()).then(data => setDivisions(data)).catch(err => console.log('error fetching division data', err));
        fetch('/district.json').then(res => res.json()).then(data => setDistricts(data)).catch(err => console.log('error fetching districts data', err));
        fetch('/upazilas.json').then(res => res.json()).then(data => setUpazilas(data)).catch(err => console.log('error fetching upazilas data', err));
    }, []);

    const filteredDistricts = selectedDivision
        ? districts.filter(d => d.division_id === selectedDivision)
        : [];

    const filteredUpazilas = selectedDistrict
        ? upazilas.filter(u => u.district_id === selectedDistrict)
        : [];

    const onSubmit = async (data) => {
        const district = districts.find(dis => dis.id === data.district);
        const upazila = upazilas.find(up => up.id === data.upazila);
        setDistrictName(district?.name || '');
        setUpazilaName(upazila?.name || '');
        setSearchTrigger(true);
        setCurrentPage(1);
    };


    const { data: donorData = {}, isLoading } = useQuery({
        queryKey: ['search-donors', selectedBloodGroup, districtName, upazilaName, currentPage],
        enabled: !!searchTrigger,
        queryFn: async () => {
            const res = await axiosPublic.get('/donors', {
                params: {
                    bloodGroup: selectedBloodGroup,
                    district: districtName,
                    upazila: upazilaName,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            return res.data;
        },
    });

    const { donors = [], total = 0, page = 1, pages = 1 } = donorData;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-[calc(100vh-65px)] p-4 dark:text-white"
        >
            <h2 className="text-3xl font-bold text-center mb-6 text-[#111827] dark:text-[#F8FAFC]">
                Search Donors
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Blood Group</span>
                        </label>
                        <select
                            {...register("bloodGroup", { required: true })}
                            className="select select-bordered w-full bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                            value={selectedBloodGroup}
                            onChange={(e) => setSelectedBloodGroup(e.target.value)}
                        >
                            <option value="">Select Blood Group</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Division</span>
                        </label>
                        <select
                            {...register("division", { required: true })}
                            onChange={(e) => setSelectedDivision(e.target.value)}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Division</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>
                                    {div.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">District</span>
                        </label>
                        <select
                            {...register("district", { required: true })}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select District</option>
                            {filteredDistricts.map((dist) => (
                                <option key={dist.id} value={dist.id}>
                                    {dist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="label">
                            <span className="label-text text-[#111827] dark:text-[#F8FAFC]">Upazila</span>
                        </label>
                        <select
                            {...register("upazila", { required: true })}
                            className="w-full p-3 rounded-md border border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-gray-800 text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D32F2F] dark:focus:ring-[#EF5350]"
                        >
                            <option value="">Select Upazila</option>
                            {filteredUpazilas.map((upz) => (
                                <option key={upz.id} value={upz.id}>
                                    {upz.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 mt-1">
                        <button
                            type="submit"
                            className="btn w-full bg-[#D32F2F] text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {searchTrigger && !isLoading && donors.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-gray-500 dark:text-gray-400 mt-10"
                >
                    No donors found.
                </motion.div>
            )}

            {searchTrigger && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6 overflow-x-auto "
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="p-4 rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 animate-pulse h-36"></div>
                            ))}
                        </div>
                    ) : donors.length > 0 ? (
                        <>
                            <table className="table w-full border-separate border-spacing-0 dark:text-white">
                                <thead className="dark:text-white">
                                    <tr>
                                        <th className="text-left">#</th>
                                        <th className="text-left">Name</th>
                                        <th className="text-left">Email</th>
                                        <th className="text-left">Division</th>
                                        <th className="text-left">District</th>
                                        <th className="text-left">Upazila</th>
                                        <th className="text-left">Blood Group</th>
                                        <th className="text-left">Created At</th>
                                        <th className="text-left">Role</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donors.map((donor, idx) => (
                                        <tr key={donor._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <td>{(page - 1) * itemsPerPage + idx + 1}</td>
                                            <td>{donor.name}</td>
                                            <td>{donor.email}</td>
                                            <td>{donor.division}</td>
                                            <td>{donor.district}</td>
                                            <td>{donor.upazila}</td>
                                            <td>{donor.blood_group}</td>
                                            <td>{new Date(donor.created_at).toLocaleDateString()}</td>
                                            <td>{donor.role}</td>
                                            <td>{donor.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination controls */}
                            <div className="flex justify-center mt-6">
                                <nav className="inline-flex rounded-md shadow">
                                    <button
                                        onClick={() => paginate(Math.max(1, page - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                                        // Show limited page numbers (max 5)
                                        let pageNum;
                                        if (pages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= pages - 2) {
                                            pageNum = pages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => paginate(pageNum)}
                                                className={`px-3 py-1 border-t border-b border-gray-300 dark:border-gray-600 ${page === pageNum
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => paginate(Math.min(pages, page + 1))}
                                        disabled={page === pages}
                                        className="px-3 py-1 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>

                            <div className="text-center mt-2 text-gray-500 dark:text-gray-400">
                                Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, total)} of {total} donors
                            </div>
                        </>
                    ) : !searchTrigger && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-gray-500 dark:text-gray-400 mt-10"
                        >
                            Please use the filters above to search for donors.
                        </motion.div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default SearchDonor;