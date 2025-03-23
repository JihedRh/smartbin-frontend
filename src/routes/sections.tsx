import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from './ProtectedRoute';

export const HomePage = lazy(() => import('src/pages/home'));
export const UserPage = lazy(() => import('src/pages/user'));
export const AccountBox = lazy(() => import('../../components/accountBox/index'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const HospitalDetail = lazy(() => import('src/layouts/map/HospitalDetail'));
export const ProfileCard = lazy(() => import('src/sections/profile/components/ProfileCard'));
export const ORBins = lazy(() => import('src/pages/OrBins'));
export const Profile = lazy(() => import('src/sections/user/view/Profile'));
export const MapView = lazy(() => import('src/layouts/map/map-view'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <AuthLayout>
          <AccountBox />
        </AuthLayout>
      ),
      index: true,
    },
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'home', element: <ProtectedRoute><HomePage /></ProtectedRoute> }, 
        { path: 'user', element: <ProtectedRoute><UserPage /></ProtectedRoute> }, 
        { path: 'OR-bin', element: <ProtectedRoute><ORBins /></ProtectedRoute> }, 
        { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> }, 
        { path: 'user_profile', element: <ProtectedRoute><ProfileCard /></ProtectedRoute> }, 
        { path: 'stats', element: <ProtectedRoute><ProductsPage /></ProtectedRoute> }, 
        { path: 'hospital', element: <ProtectedRoute><MapView /></ProtectedRoute> }, 
        { path: 'hospital/:hospitalId', element: <ProtectedRoute><HospitalDetail /></ProtectedRoute> }, 
        { path: '404', element: <Page404 /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
