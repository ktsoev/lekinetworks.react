import { useTranslation } from 'react-i18next';
import logoSrc from '../../assets/logo.png';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src={logoSrc} alt="LEKI Networks" className={styles.logoImg} />
          <span className={styles.logoText}>LEKI</span>
        </div>
        <nav className={styles.links}>
          <a href="#" className={styles.link}>{t('common.footer.privacy')}</a>
          <a href="#" className={styles.link}>{t('common.footer.terms')}</a>
          <a href="#" className={styles.link}>{t('common.footer.support')}</a>
        </nav>
        <p className={styles.copy}>© {new Date().getFullYear()} LEKI</p>
      </div>
    </footer>
  );
}
