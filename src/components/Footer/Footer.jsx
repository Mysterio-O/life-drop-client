import React from 'react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/logo-transparent.png';
const Footer = () => {


    // const handleCategories = () => {
    //     // console.log('clicked');
    //     if (window.location.pathname === '/#donation-requests') {
    //         const element = document.getElementById('donation-requests');
    //         if (element) {
    //             element.scrollIntoView({ behavior: 'smooth' })
    //         } else {
    //             setTimeout(() => {
    //                 const retryElement = document.getElementById('donation-requests');
    //                 if (retryElement) {
    //                     retryElement.scrollIntoView({ behavior: 'smooth' });
    //                 }
    //             }, 500);
    //         }
    //     }
    //     else {
    //         navigate('/#donation-requests');
    //     }

    // }

    const { user } = useAuth();

    const guestLinks = <>
        <NavLink
            key="donation-requests"
            to="/#donation-requests"
            className="text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
        >
            Donation Requests
        </NavLink>
        <NavLink
            key="blog"
            to="/blog"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? 'font-bold underline' : ''}`
            }
        >
            Blog
        </NavLink>
        <NavLink
            key="login"
            to="/login"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? 'font-bold underline' : ''}`
            }
        >
            Login
        </NavLink>
    </>;

    const userLinks = <>
        <NavLink
            key="donation-requests"
            to="/#donation-requests"
            className="text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
        >
            Donation Requests
        </NavLink>
        <NavLink
            key="blog"
            to="/blog"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? 'font-bold underline' : ''}`
            }
        >
            Blog
        </NavLink>
        <NavLink
            key="funding"
            to="/funding"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? 'font-bold underline' : ''}`
            }
        >
            Give Funding
        </NavLink>
        <NavLink
            key="give-funding"
            to="/give-funding"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? 'font-bold underline' : ''}`
            }
        >
            Funding
        </NavLink>
    </>;

    const additionalLinks = <>
        <NavLink
            key="about"
            to="/about-us"
            className="text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
        >
            About Us
        </NavLink>
        <NavLink
            key="privacy"
            to="/privacy-policy"
            className="text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
        >
            Privacy Policy
        </NavLink>
        <NavLink
            key="terms"
            to="/terms"
            className="text-[#111827] dark:text-[#F8FAFC] px-2 py-1 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
        >
            Terms of Service
        </NavLink>
    </>;

    const socialLinks = [
        <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336] transition-colors mx-2"
        >
            <FaFacebookF className="text-2xl" />
        </a>,
        <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336] transition-colors mx-2"
        >
            <FaTwitter className="text-2xl" />
        </a>,
        <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D32F2F] dark:text-[#EF5350] hover:text-[#B71C1C] dark:hover:text-[#F44336] transition-colors mx-2"
        >
            <FaInstagram className="text-2xl" />
        </a>,
    ];

    return (
        <motion.footer
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="bg-[#F9FAFB] dark:bg-[#1E293B] py-6 border-t border-[#E5E7EB] dark:border-[#334155]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



                <div className="flex flex-col gap-4 md:grid md:grid-cols-6 md:grid-rows-2 md:gap-0">

                    <div className="col-span-2 flex flex-col md:flex-row gap-8">
                        {/* Navigation Links */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-center md:text-left space-y-3"
                        >
                            <img src={logo} alt="" className='h-10 mx-auto md:mx-0' />
                            <ul className="flex flex-wrap justify-center md:justify-start items-center">

                                {
                                    user ? userLinks : guestLinks
                                }
                            </ul>
                        </motion.div>
                        {/* divider */}
                        <div className='w-80 md:w-[2px] bg-black/40 dark:bg-white h-[2px] md:h-36 mx-auto md:mx-0' />
                    </div>


                    <div className="col-span-2 col-start-3 flex flex-col md:flex-row gap-8 md:ml-8">
                        {/* Additional Links */}
                        <motion.div
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mt-3"
                        >
                            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC] mb-4">
                                More About Us
                            </h3>
                            <ul className="space-y-2">
                                {additionalLinks}
                            </ul>
                        </motion.div>
                        {/* divider */}
                        <div className='w-80 md:w-[2px] bg-black/40 dark:bg-white h-[2px] md:h-36 mx-auto md:mx-0' />
                    </div>


                    <div className="col-span-2 col-start-5">
                        {/* Contact & Social */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center md:text-end"
                        >
                            <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F8FAFC] mb-4">
                                Connect With Us
                            </h3>
                            <p className="mb-4 text-[#4B5563] dark:text-[#94A3B8]">
                                +1-800-LIFEDROP<br />
                                support@lifedrop.com
                            </p>
                            <div className="flex justify-center md:justify-end">
                                {socialLinks.map((link, index) => (
                                    <motion.a
                                        key={index}
                                        href={link.props.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ scale: 1 }}
                                        whileHover={{
                                            scale: 1.2,
                                            boxShadow: '0 0 10px rgba(211, 47, 47, 0.7)',
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={link.props.className}
                                    >
                                        {link.props.children}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>


                    <div className="col-span-6 row-start-2 ">
                        <div className="mt-8 text-center text-sm text-[#4B5563] dark:text-[#94A3B8]">
                            © 2025 LifeDrop. All rights reserved.
                        </div>
                    </div>
                </div>



                {/* <div className="flex justify-around">
                    
                    
                   
                    <div className="divider divider-horizontal"></div>
                    
                </div> */}

            </div>
        </motion.footer>
    );
};

export default Footer;