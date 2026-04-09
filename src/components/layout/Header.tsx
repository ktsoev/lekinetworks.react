import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoSrc from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Container } from './Container';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitch } from './LanguageSwitch';
import styles from './Header.module.css';

interface HeaderProps {
  variant?: 'public' | 'app';
}

export function Header({ variant = 'public' }: HeaderProps) {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
            <img src={logoSrc} alt="LEKI Networks" className={styles.logoImg} />
            <span className={styles.logoText}>
              LEKI<span className={styles.logoAccent}>Networks</span>
            </span>
          </Link>

          <nav className={styles.nav}>
            <LanguageSwitch />
            <ThemeToggle />
            {variant === 'app' && isAuthenticated ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
                  {t('common.nav.home')}
                </Button>
                <span className={styles.userEmail}>{user?.email}</span>
              </>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { window.location.href = isAuthenticated ? '/dashboard' : '/auth/login'; }}
              >
                {isAuthenticated ? t('common.nav.dashboard') : t('common.nav.signIn')}
              </Button>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
