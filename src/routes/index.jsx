import { Navigate, useRoutes } from 'react-router-dom';
import {
    LoginPage,
    //User
    UserCreatePage, UserEditPage, UserListPage,
    //Main
    Page404
} from './elements';

import { PATH_AFTER_LOGIN } from '../config-global';
import GeneralAppPage from '../pages/Dashboard/GeneralAppPage';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard/DashboardLayout';
import GuestGuard from '../auth/GuestGuard';
import AuthGuard from '../auth/AuthGuard';
import UserAccountEditPage from '../pages/Dashboard/Account/UserAccountEditPage';
import DatabaseListPage from '../pages/Dashboard/Database/DatabaseListPage';
import DatabaseCreatePage from '../pages/Dashboard/Database/DatabaseCreatePage';
import DatabaseEditPage from '../pages/Dashboard/Database/DatabaseEditPage';
import AorListPage from '../pages/Dashboard/Aor/AorListPage';
import AorCreatePage from '../pages/Dashboard/Aor/AorCreatePage';
import AorEditPage from '../pages/Dashboard/Aor/AorEditPage';
export default function Router() {
    return useRoutes([
        // Landing Page
        {
            path: '/',
            element: (
                <GuestGuard>
                    <LoginPage />
                </GuestGuard>
            )

        },
        // Auth
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <LoginPage />
                        </GuestGuard>
                    )
                }

            ]
        },

        // dashboard
        {
            path: 'dashboard',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                { path: 'account', element: <UserAccountEditPage /> },
                { element: <Navigate to={PATH_AFTER_LOGIN} replace={true} />, index: true },
                {
                    path: 'aor',
                    children: [
                        { element: <Navigate to="/dashboard/aor/list" replace />, index: true },
                        { path: 'list', element: <AorListPage /> },
                        { path: 'new', element: <AorCreatePage /> },
                        { path: ':name/edit', element: <AorEditPage /> }
                    ],
                },
                {
                    path: 'database',
                    children: [
                        { element: <Navigate to="/dashboard/database/list" replace />, index: true },
                        { path: 'list', element: <DatabaseListPage /> },
                        { path: 'new', element: <DatabaseCreatePage /> },
                        { path: ':name/edit', element: <DatabaseEditPage /> }
                    ],
                },
                {
                    path: 'user',
                    children: [
                        { element: <Navigate to="/dashboard/user/list" replace />, index: true },
                        { path: 'list', element: <UserListPage /> },
                        { path: 'new', element: <UserCreatePage /> },
                        { path: ':name/edit', element: <UserEditPage /> }
                    ],
                },

            ]

        },
        {
            element: <CompactLayout />,
            children: [
                { path: '404', element: <Page404 /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },

    ])
}
