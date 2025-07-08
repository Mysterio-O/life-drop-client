import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {

    const { user, loading } = useAuth();
    const location = useLocation();
    // console.log(location);
    const from = location?.pathname;

    if (loading) return <span className="loading loading-ring loading-xl"></span>;

    if (!user) {
        return <Navigate state={from} to='/login' />
    }

    return children
};

export default PrivateRoute;