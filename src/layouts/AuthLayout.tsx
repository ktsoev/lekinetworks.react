import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import logoSrc from '../assets/logo.png';
import { Background } from '../components/ui/Background';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { LanguageSwitch } from '../components/layout/LanguageSwitch';
import { PageTransition } from '../components/ui/PageTransition';
import styles from './AuthLayout.module.css';

export function AuthLayout() {
  const location = useLocation();
  return (
    <div className={styles.layout}>
      <Background />
      <div className={styles.controls}>
        <LanguageSwitch />
        <ThemeToggle />
      </div>
      <div className={styles.card}>
        <Link to="/" className={styles.logo}>
          <img src={logoSrc} alt="LEKI Networks" className={styles.logoImg} />
          <span className={styles.logoText}>
            LEKI<span className={styles.logoAccent}>Networks</span>
          </span>
        </Link>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
}
