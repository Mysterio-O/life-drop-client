import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div className='max-w-[1600px] mx-auto'>
            <div>
                <Navbar />
            </div>
            <section>
                <Outlet />
            </section>
        </div>
    );
};

export default RootLayout;