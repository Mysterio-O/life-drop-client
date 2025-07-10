import React from 'react';
import useAuth from '../../../hooks/useAuth';

const Body = () => {
    const { user } = useAuth();

    return (
        <div className='flex flex-col justify-center items-center gap-4'>
            <img src={user?.photoURL} alt="" className='h-28 w-28 rounded-full border-2 border-[#D32F2F] dark:border-[#EF5350] shadow-md' />
            <h3 className='font-bold text-xl text-[#111827] dark:text-[#F8FAFC]'>{user?.displayName}</h3>
        </div>
    );
};

export default Body;