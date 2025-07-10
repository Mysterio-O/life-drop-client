import React from 'react';
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { motion } from 'motion/react'
import { useTheme } from '../contexts/ThemeContext';


const ThemeSwitch = () => {
    const { theme, toggleTheme } = useTheme();
    // console.log('current theme->', theme, 'fn toggleTheme->', toggleTheme)

    const iconVariants = {
        initial: { scale: 1, rotate:"0deg" },
        whileHover: { scale: 2, x: 5, rotate: theme === 'dark' ? '0deg' : '180deg', },
        whileTap:{scale:1.4,x:3,rotate: theme === 'dark' ? "-180deg" : "180deg"},
        transition: { duration: 0.3 }
    }

    return (
        <div
        >
            <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="whileHover"
                whileTap="whileTap"
                transition="transition"
                className='cursor-pointer'
                onClick={toggleTheme}>
                {
                    theme === 'light'
                        ? <CiLight className='text-yellow-600' size={24} />
                        : <MdDarkMode className='text-yellow-500' size={24} />
                }
            </motion.div>
        </div>
    );
};

export default ThemeSwitch;