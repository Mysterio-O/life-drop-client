import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Scroll from '../pages/Scroll/Scroll';

const RootLayout = () => {
    return (
        <div className='bg-[#FFFFFF] dark:bg-[#0F172A] transition-colors duration-300'>
                <Scroll/>
            <div className='max-w-[1600px] mx-auto'>
                <div className='sticky top-0 z-[50]'>
                    <Navbar />
                </div>
                <section>
                    <Outlet />
                </section>
                <footer>
                    <Footer />
                </footer>
            </div>
        </div>
    );
};

export default RootLayout;