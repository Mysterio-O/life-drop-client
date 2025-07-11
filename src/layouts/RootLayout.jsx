import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div className='bg-[#FFFFFF] dark:bg-[#0F172A] transition-colors duration-300'>
            <div className='max-w-[1600px] mx-auto'>
                <div>
                    <Navbar />
                </div>
                <section>
                    <Outlet />
                </section>
            </div>
        </div>
    );
};

export default RootLayout;