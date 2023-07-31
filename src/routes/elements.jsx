import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );



// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
// DASHBOARD: GENERAL
// DANSHBOARD: USER

export const UserListPage = Loadable(lazy(() => import('../pages/Dashboard//User/UserListPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/Dashboard/User/UserCreatePage')));
export const UserEditPage = Loadable(lazy(() => import('../pages/Dashboard/User/UserEditPage')));


// MAIN
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));