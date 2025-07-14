import React from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const ProfilePicture = ({ email }) => {

    const axiosPublic = useAxiosPublic();
    console.log(email, 'frm profile picture');

    const { data: userInfo, isLoading } = useQuery({
        queryKey: ['photoURL', email],
        enabled: !!email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/user/profile-picture/${email}`);
            return res.data
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                <div className="w-16 h-4 mt-1 bg-gray-300 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
        );
    }

    // console.log(userInfo);
    const { name, photoURL } = userInfo.userInfo;
    console.log(name,photoURL);

    return (
        <div className='flex flex-col items-center'>
            <img src={photoURL} alt="" className='w-12 h-12 rounded-full' />
            <span className='font-bold'>{name}</span>
        </div>
    );
};

export default ProfilePicture;