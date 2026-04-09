import { useTranslation } from 'react-i18next';
import { motion, type Variants } from 'framer-motion';
import { Card } from '../ui/Card';
import { Container } from '../layout/Container';
import styles from './Features.module.css';

const featureKeys = ['vless', 'devices', 'instant'] as const;

const icons = [
  <svg key="vless" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="devices" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
  </svg>,
  <svg key="instant" className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" strokeLinecap="round" />
  </svg>,
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function Features() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.heading}>{t('landing.features.heading')}</h2>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {featureKeys.map((key, i) => (
            <motion.div key={key} variants={itemVariants} className={styles.cell}>
              <Card className={styles.card}>
                <div className={styles.iconWrap}>{icons[i]}</div>
                <h3 className={styles.featureTitle}>{t(`landing.features.${key}.title`)}</h3>
                <p className={styles.featureDesc}>{t(`landing.features.${key}.desc`)}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
