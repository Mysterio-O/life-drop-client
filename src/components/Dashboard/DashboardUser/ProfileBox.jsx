import React from 'react';

const ProfileBox = ({ acc, isSelected, handleSelectAccount }) => {
    // console.log(acc);
    return (
        <div
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${isSelected ? 'bg-[#E5E7EB] dark:bg-[#334155] border-2 border-[#D32F2F] dark:border-[#EF5350]' : 'hover:bg-[#E5E7EB] dark:hover:bg-[#334155]'}`}
            onClick={() => handleSelectAccount(acc)}
        >
            <div className='rounded-full p-1 border-2 border-[#D32F2F] dark:border-[#EF5350]'>
                <img src={acc?.photoURL} alt="" className='w-16 h-16 rounded-full' />
            </div>
            <div>
                <h3 className='text-lg font-medium text-[#111827] dark:text-[#F8FAFC]'>{acc?.displayName || acc?.email}</h3>
                <p className='text-sm text-[#4B5563] dark:text-[#94A3B8]'>{acc?.email}</p>
                <p className='text-xs text-[#4B5563] dark:text-[#94A3B8]'>
                    Email/Password
                </p>
            </div>
        </div>
    );
};

export default ProfileBox;