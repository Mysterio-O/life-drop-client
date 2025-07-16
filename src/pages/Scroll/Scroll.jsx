import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

const Scroll = () => {
    const location = useLocation();
    const { pathname } = location;
    useEffect(() => {
        // console.log('Scroll triggered for pathname:', pathname);
        window.scrollTo({

            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname])
    return null;
};

export default Scroll;