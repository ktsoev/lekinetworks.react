import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Verify } from '../pages/Verify';
import { Dashboard } from '../pages/Dashboard';
import { Purchase } from '../pages/Purchase';
import { Payment } from '../pages/Payment';
import { PaymentSuccess } from '../pages/PaymentSuccess';
import { SubscriptionDetails } from '../pages/SubscriptionDetails';
import { Renew } from '../pages/Renew';
import { RenewSubscription } from '../pages/RenewSubscription';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Landing /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'verify', element: <Verify /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'purchase', element: <Purchase /> },
      { path: 'payment/:tariffId', element: <Payment /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: 'subscription/:id', element: <SubscriptionDetails /> },
      { path: 'renew', element: <Renew /> },
      { path: 'renew/:subscriptionId', element: <RenewSubscription /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
