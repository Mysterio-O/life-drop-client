import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Dashboard from '../components/Dashboard/Dashboard/Dashboard';
import { Outlet } from 'react-router';
import { LuPanelRightClose, LuPanelLeftClose } from 'react-icons/lu';
import { FaUserCircle } from 'react-icons/fa';
import DashboardUser from '../components/Dashboard/DashboardUser/DashboardUser';

const DashboardLayout = () => {

    const { user } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const closeDashboard = () => {
        setIsMenuOpen(false);
    };

    const handleUserDashClose = ()=> {
        setIsUserMenuOpen(false);
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 bg-gray-200 dark:bg-gray-800 transition-colors duration-300 raleway-regular min-h-screen">
            {/* Dashboard Sidebar */}
            <div
                className={`
          fixed  top-0 left-0 h-full w-3/4 sm:w-1/3 md:w-1/4 bg-white dark:bg-gray-700 shadow-lg
          transform transition-transform duration-300 ease-in-out z-50
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            >
                <Dashboard closeDashboard={closeDashboard} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-[25%] lg:px-[26%]">
                {/* Toggle Button */}
                <div className="py-4 px-2 flex justify-between text-center md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMenuOpen ? (
                            <LuPanelRightClose size={30} className="rotate-180" />
                        ) : (
                            <LuPanelLeftClose size={30} className='text-black dark:text-white'/>
                        )}
                    </button>
                    {/* User Sidebar Toggle */}
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        onKeyDown={(e) => ['Enter', ' '].includes(e.key) && setIsUserMenuOpen(!isUserMenuOpen)}
                        aria-label={isUserMenuOpen ? 'Close user menu' : 'Open user menu'}
                        className="focus:outline-none"
                    >
                        {user?.photoURL ? (
                            <img src={user?.photoURL} alt="User profile" className="h-10 w-10 rounded-full" />
                        ) : (
                            <FaUserCircle size={30} />
                        )}
                    </button>
                </div>

                {/* Outlet (Main Content Area) */}
                <div className="mx-auto w-full  px-4">
                    <Outlet />
                </div>
            </div>




            {/* Dashboard User (Right Sidebar) */}
            <div className={`
          fixed top-0 right-0 h-screen w-3/4 sm:w-1/3 lg:w-1/4 bg-white dark:bg-gray-400 shadow-lg
          transform transition-transform duration-300 ease-in-out z-50
          ${isUserMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
        `}>
                <DashboardUser handleUserDashClose={handleUserDashClose}/>
            </div>

            {/* Overlay for mobile when menu is open */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                    onClick={closeDashboard}
                ></div>
            )}
            {isUserMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                    onClick={handleUserDashClose}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;