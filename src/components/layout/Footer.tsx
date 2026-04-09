import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.copy}>© {new Date().getFullYear()} LEKI Networks. {t('common.footer.rights')}</p>
          <nav className={styles.links}>
            <a href="#" className={styles.link}>{t('common.footer.privacy')}</a>
            <a href="#" className={styles.link}>{t('common.footer.terms')}</a>
            <a href="#" className={styles.link}>{t('common.footer.support')}</a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
