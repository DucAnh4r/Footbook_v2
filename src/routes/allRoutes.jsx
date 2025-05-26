import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ShowFriendsPage from '../Pages/FriendsPage/Pages/ShowFriendsPage';
import HighLightStoryViewer from '../Components/HighLightStoryViewer';
import ErrorPage from '../Pages/ExtendPage/ErrorPage';
import PostPage from '../Pages/PostPage/PostPage';
import { checkAuth } from '../utils/checkAuth';

const PhotoPage = lazy(() => import('../Pages/Photo/PhotoPage'));
const Homepage = lazy(() => import('../Pages/Homepage/Homepage'));
const Messagepage = lazy(() => import('../Pages/MessagePage/Messagepage'));
const FriendsPage = lazy(() => import('../Pages/FriendsPage/FriendsHomePage'));
const FlagPage = lazy(() => import('../Pages/FlagPage/FlagPage'));
const GroupsPage = lazy(() => import('../Pages/GroupsPage/GroupsHomePage'));
const GroupsProfile = lazy(() => import('../Pages/GroupProfile/GroupProfile'));
const ProfilePage = lazy(() => import('../Pages/ProfilePage/UserProfilePage/ProfilePage'));
const FriendProfilePage = lazy(() => import('../Pages/ProfilePage/FriendProfilePage/FriendProfilePage'));
const SearchPage = lazy(() => import('../Pages/SearchPage/HomePageSearch'));
const LoginPage = lazy(() => import('../Pages/LoginPage/LoginPage'));

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = checkAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const homeRoutes = [
    {
        path: "/",
        component: <ProtectedRoute><Homepage /></ProtectedRoute>
    },
    {
        path: "/profile",
        component: <ProtectedRoute><ProfilePage /></ProtectedRoute>
    },
    {
        path: "/friendprofile/:userId2",
        component: <ProtectedRoute><FriendProfilePage /></ProtectedRoute>
    },
    {
        path: "/friends",
        component: <ProtectedRoute><FriendsPage /></ProtectedRoute>
    },
    {
        path: "/friends/:type",
        component: <ProtectedRoute><ShowFriendsPage /></ProtectedRoute>
    },
    {
        path: "/pages",
        component: <ProtectedRoute><FlagPage /></ProtectedRoute>
    },
    {
        path: "/groups",
        component: <ProtectedRoute><GroupsPage /></ProtectedRoute>
    },
    {
        path: "/group/a",
        component: <ProtectedRoute><GroupsProfile /></ProtectedRoute>
    },
    {
        path: "/photo/:postId",
        component: <ProtectedRoute><PhotoPage /></ProtectedRoute>
    },
    {
        path: "/search/users",
        component: <ProtectedRoute><SearchPage /></ProtectedRoute>
    },
    {
        path: "/search/:type",
        component: <ProtectedRoute><SearchPage /></ProtectedRoute>
    },
    {
        path: "/login",
        component: <LoginPage />
    },
    {
        path: "/error",
        component: <ErrorPage />
    },
    {
        path: "/highlight",
        component: <ProtectedRoute><HighLightStoryViewer /></ProtectedRoute>
    },
    {
        path: "/post/:postId",
        component: <ProtectedRoute><PostPage /></ProtectedRoute>
    },
];

const messageRoutes = [
    {
        path: "/messages",
        component: <ProtectedRoute><Messagepage /></ProtectedRoute>
    },
];

export { homeRoutes, messageRoutes };