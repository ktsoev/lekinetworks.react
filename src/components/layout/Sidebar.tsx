import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
  {
    to: '/dashboard',
    end: true,
    labelKey: 'common.nav.subscriptions',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/dashboard/purchase',
    end: false,
    labelKey: 'common.actions.buySubscription',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/dashboard/renew',
    end: false,
    labelKey: 'renew.nav',
    icon: (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.93" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  return (
    <aside className={styles.sidebar}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [styles.link, isActive ? styles.active : ''].filter(Boolean).join(' ')
          }
        >
          {item.icon}
          {t(item.labelKey)}
        </NavLink>
      ))}
      <div className={styles.spacer} />
      <button className={styles.signOut} onClick={() => logout()}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('common.nav.signOut')}
      </button>
    </aside>
  );
}
