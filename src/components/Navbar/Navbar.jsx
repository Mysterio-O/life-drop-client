import { Link, NavLink, useNavigate } from "react-router";
import { FaEllipsisV } from "react-icons/fa";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { motion } from "motion/react";
import Swal from "sweetalert2";
import logo from '../../assets/logo-transparent.png';
import ThemeSwitch from "../../shared/ThemeSwitch";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, userLogOut } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogOut = () => {
        // Show confirmation dialog before logout
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to log out of your LifeDrop account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#D32F2F", // Light mode primary color
            cancelButtonColor: "#4B5563", // Light mode secondary color
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
            background: "#F9FAFB", // Light mode surface color
            customClass: {
                popup: "dark:bg-[#1E293B]", // Dark mode surface color
                title: "text-[#111827] dark:text-[#F8FAFC]",
                text: "text-[#4B5563] dark:text-[#94A3B8]",
                confirmButton: "dark:bg-[#EF5350]", // Dark mode primary color
                cancelButton: "dark:bg-[#94A3B8]" // Dark mode secondary color
            }
        }).then((result) => {
            if (result.isConfirmed) {
                userLogOut()
                    .then(() => {
                        console.log("user logged out");
                        Swal.fire({
                            icon: "success",
                            title: "Logged Out Successfully!",
                            text: "Redirecting to login page...",
                            timer: 1500,
                            showConfirmButton: false,
                            background: "#F9FAFB", // Light mode surface color
                            customClass: {
                                title: "text-[#111827] dark:text-[#F8FAFC]",
                                text: "text-[#4B5563] dark:text-[#94A3B8]",
                                popup: "dark:bg-[#1E293B]" // Dark mode surface color
                            }
                        });
                        navigate("/login");
                    })
                    .catch((err) => {
                        console.log("error logging out user", err);
                        Swal.fire({
                            icon: "error",
                            title: "Logout Failed",
                            text: "Unable to log out. Please try again.",
                            confirmButtonColor: "#D32F2F", // Light mode error color
                            customClass: {
                                confirmButton: "dark:bg-[#EF5350]" // Dark mode error color
                            }
                        });
                    });
            }
        });
    };

    const handleCategories = () => {
        // console.log('clicked');
        if (window.location.pathname === '/#donation-requests') {
            const element = document.getElementById('donation-requests');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            } else {
                setTimeout(() => {
                    const retryElement = document.getElementById('donation-requests');
                    if (retryElement) {
                        retryElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
        }
        else {
            navigate('/#donation-requests');
        }

    }

    // Define guestLinks as an array of JSX elements
    const guestLinks = [
        <NavLink
            onClick={handleCategories}
            key="donation-requests"
            to="/#donation-requests"
            className={
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors`
            }
        >
            Donation Requests
        </NavLink>,
        <NavLink
            key="blog"
            to="/blog"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Blog
        </NavLink>,
        <NavLink
            key="login"
            to="/login"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Login
        </NavLink>
    ];

    // Define userLinks as an array of JSX elements
    const userLinks = [
        <NavLink
            onClick={handleCategories}
            key="donation-requests"
            to="/#donation-requests"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors`
            }
        >
            Donation Requests
        </NavLink>,
        <NavLink
            key="blog"
            to="/blog"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Blog
        </NavLink>,
        <NavLink
            key="funding"
            to="/funding"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Funding
        </NavLink>,
        <NavLink
            key="give-funding"
            to="/give-funding"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Give Funding
        </NavLink>,
        <NavLink
            key="be-a-volunteer"
            to="/be-a-volunteer"
            className={({ isActive }) =>
                `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                }`
            }
        >
            Be a Volunteer
        </NavLink>,
        <div key="dropdown" className="dropdown dropdown-end">
            <motion.div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="w-10 rounded-full border-2 border-[#D32F2F] dark:border-[#EF5350]">
                    <img
                        alt="User Avatar"
                        src={user?.photoURL || "/default-avatar.png"}
                    />
                </div>
            </motion.div>
            <motion.ul
                tabIndex={0}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#F9FAFB] dark:bg-[#1E293B] rounded-box w-52"
            >
                <li>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors ${isActive ? "font-bold bg-[#EF5350]" : ""
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <button
                        onClick={handleLogOut}
                        className="text-[#111827] dark:text-[#F8FAFC] px-3 py-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
                    >
                        Logout
                    </button>
                </li>
            </motion.ul>
        </div>
    ];

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#FFFFFF] dark:bg-[#0F172A] transition-colors duration-300 shadow-md px-4 py-3"
        >
            <div className="flex justify-between items-center">
                <Link to="/" className="flex-1">
                    <img src={logo} alt="" className="h-10" />
                </Link>

                <div className="hidden md:flex gap-4 items-center">
                    {user ? (
                        <>
                            {userLinks.map((link, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration:0.3 }}
                                    whileHover={{scale:1.15,y:5}}
                                    whileTap={{scale:1,y:0}}
                                >
                                    {link}
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            {guestLinks.map((link, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{backgroundColor: '#D32F2F'}}
                                    className="inline-block"
                                >
                                    {link}
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <motion.button
                        onClick={toggleMenu}
                        className="text-[#111827] dark:text-[#F8FAFC] p-2 rounded-md hover:bg-[#D32F2F] hover:text-white dark:hover:bg-[#EF5350] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaEllipsisV size={24} />
                    </motion.button>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute right-4 top-16 z-50 bg-[#F9FAFB] dark:bg-[#1E293B] rounded-box shadow p-4 w-52 space-y-2 flex flex-col"
                        >
                            {user ? userLinks : guestLinks}
                        </motion.div>
                    )}
                </div>
                <div className="ml-3">
                    <ThemeSwitch />
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;