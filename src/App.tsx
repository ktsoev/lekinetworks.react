import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
//import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/ui/Toast';
//import { Preloader } from './components/ui/Preloader';
import { router } from './routes';
import { queryClient } from './queryClient';

export default function App() {
  const [setLoading] = useState(true);
/*  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);*/

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            {/*<AnimatePresence>
              {loading && <Preloader key="preloader" />}
            </AnimatePresence>*/}
            <RouterProvider router={router} />
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
