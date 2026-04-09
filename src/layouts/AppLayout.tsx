import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { Background } from '../components/ui/Background';
import { PageTransition } from '../components/ui/PageTransition';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const location = useLocation();
  return (
    <div className={styles.layout}>
      <Background />
      <Header variant="app" />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition routeKey={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
