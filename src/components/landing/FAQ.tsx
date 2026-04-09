import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '../layout/Container';
import styles from './FAQ.module.css';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <Container>
        <h2 className={styles.heading}>{t('landing.faq.heading')}</h2>
        <div className={styles.list}>
          {faqKeys.map((key, i) => (
            <div key={key} className={styles.item}>
              <button
                className={styles.trigger}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className={styles.question}>{t(`landing.faq.${key}`)}</span>
                <svg
                  className={[styles.chevron, open === i ? styles.open : ''].filter(Boolean).join(' ')}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className={styles.answer}>
                      {t(`landing.faq.${key.replace('q', 'a') as 'q1'}`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
