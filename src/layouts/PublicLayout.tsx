import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Background } from '../components/ui/Background';
import { PageTransition } from '../components/ui/PageTransition';
import styles from './PublicLayout.module.css';

export function PublicLayout() {
  const location = useLocation();
  return (
    <div className={styles.layout}>
      <Background />
      <Header variant="public" />
      <main className={styles.content}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
