import React from 'react';
import useUserRole from '../../../../hooks/useUserRole';
import DonorOverview from './DonorOverview';
import AdminOverview from './AdminOverview';


const OverView = () => {

    const { role } = useUserRole();

    if (role === 'donor') return <DonorOverview />
    if (role === "admin" || role === 'volunteer') return <AdminOverview />
};

export default OverView;