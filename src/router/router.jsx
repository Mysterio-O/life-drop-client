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
import AllDonations from "../components/Dashboard/Pages/AllDonations";
import SharedRoute from "../routes/SharedRoute";
import ContentManagement from "../components/Dashboard/Pages/ContentManagement/ContentManagement";
import AddBlog from "../components/Dashboard/Pages/ContentManagement/AddBlog";
import UpdateContent from "../components/Dashboard/Pages/ContentManagement/UpdateContent";
import Blogs from "../pages/Blog/Blogs";
import AllUsers from "../components/Dashboard/Pages/AllUsers";
import AdminRoute from "../routes/AdminRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import GiveFunding from "../pages/Funding/GiveFunding";
import Messages from "../components/Dashboard/Pages/Message/Messages";
import Funding from "../pages/Funding/Funding";
import UpdateDonationRequest from "../components/Dashboard/Pages/UpdateDonationRequest";
import AboutUs from "../pages/AboutUs/AboutUs";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndService from "../pages/TermsAndService/TermsAndService";
import Setting from "../components/Dashboard/Pages/Setting";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        errorElement: <ErrorPage />,
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
                Component: Request
            },
            {
                path: '/search-donors',
                Component: SearchDonor
            },
            {
                path: 'forbidden',
                Component: Forbidden
            },
            {
                path: '/blog',
                Component: Blogs
            },
            {
                path: '/give-funding',
                element: <PrivateRoute>
                    <GiveFunding />
                </PrivateRoute>
            },
            {
                path: 'funding',
                element: <PrivateRoute>
                    <Funding />
                </PrivateRoute>
            },
            {
                path: '/about-us',
                Component: AboutUs
            },
            {
                path: '/privacy-policy',
                Component: PrivacyPolicy
            },
            {
                path: '/terms',
                Component: TermsAndService
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
            },
            {
                path: 'all-blood-donation-request',
                element: <SharedRoute>
                    <AllDonations />
                </SharedRoute>
            },
            {
                path: 'content-management',
                element: <SharedRoute>
                    <ContentManagement />
                </SharedRoute>
            },
            {
                path: 'content-management/add-blog',
                element: <SharedRoute>
                    <AddBlog />
                </SharedRoute>
            },
            {
                path: 'content-management/edit-blog/:id',
                element: <SharedRoute>
                    <UpdateContent />
                </SharedRoute>
            },
            {
                path: "all-users",
                element: <AdminRoute>
                    <AllUsers />
                </AdminRoute>
            },
            {
                path: 'all-message',
                element: <SharedRoute>
                    <Messages />
                </SharedRoute>
            },
            {
                path: 'edit-request/:id',
                Component: UpdateDonationRequest
            },
            {
                path: 'setting',
                Component: Setting
            }
        ]
    }
])