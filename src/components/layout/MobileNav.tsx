import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileNav.module.css';

export function MobileNav() {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className={styles.nav} aria-label="Mobile navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('common.nav.home')}
      </NavLink>

      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" strokeLinecap="round" />
        </svg>
        {t('common.nav.subscriptions')}
      </NavLink>

      <NavLink
        to="/dashboard/purchase"
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
        {t('common.nav.buy')}
      </NavLink>

      <NavLink
        to="/dashboard/renew"
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')
        }
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.51 15a9 9 0 1 0 .49-4.93" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('renew.nav')}
      </NavLink>

      <button className={styles.item} onClick={() => logout()}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('common.nav.signOut')}
      </button>
    </nav>
  );
}
