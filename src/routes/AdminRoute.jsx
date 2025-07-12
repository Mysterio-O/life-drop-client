import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';

const AdminRoute = ({children}) => {


    const {user,loading}=useAuth();
    const {role,role_loading}=useUserRole();

    const location = useLocation();
    const from = location.pathname;


    if(loading || role_loading) {
        return <span className="loading loading-ring loading-xl"></span>;
    }

    if(!user) {
        return <Navigate state={from} to="/login"/>
    }
    if(role !== 'admin') {
        return <Navigate to="/forbidden"/>
    }


    return children
};

export default AdminRoute;