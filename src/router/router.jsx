import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "../routes/PrivateRoutes"
import Profile from "../components/Dashboard/Pages/Profile";
import CreateRequest from "../components/Dashboard/Pages/CreateRequest";
import MyDonationRequest from "../components/Dashboard/Pages/MyDonationRequest";
import Request from "../components/DonationRequests/Request";
import SearchDonor from "../pages/SearchDonor/SearchDonor";
import Forbidden from "../shared/Forbidden";
import OverView from "../components/Dashboard/Pages/Overviews/Overview";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/login',
                Component: Login
            },
            {
                path: '/register',
                Component: Register
            },
            {
                path: '/donation-request/:id',
                element: <PrivateRoute>
                    <Request />
                </PrivateRoute>
            },
            {
                path: '/search-donors',
                Component: SearchDonor
            },
            {
                path: 'forbidden',
                Component: Forbidden
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: OverView
            },
            {
                path: 'profile',
                Component: Profile
            },
            {
                path: 'create-donation-request',
                Component: CreateRequest
            },
            {
                path: 'my-donation-requests',
                Component: MyDonationRequest
            }
        ]
    }
])