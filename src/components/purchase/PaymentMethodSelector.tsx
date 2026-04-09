import { useTranslation } from 'react-i18next';
import type { PaymentMethod, PaymentMethodInfo } from '../../types';
import { Card } from '../ui/Card';
import styles from './PaymentMethodSelector.module.css';

const methodIcons: Record<string, React.ReactNode> = {
  yookassa: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" strokeLinecap="round" />
      <path d="M6 15h4" strokeLinecap="round" />
    </svg>
  ),
  crypto: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.5 8.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5 1 2.5 2.5 0 2-2.5 3-2.5 3M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  telegram: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 5L2 12.5l7 1M21 5l-5 14-4.5-6M21 5L9 13.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface PaymentMethodSelectorProps {
  methods: PaymentMethodInfo[];
  selected: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ methods, selected, onSelect }: PaymentMethodSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.list} role="radiogroup" aria-label={t('purchase.steps.paymentMethod')}>
      {methods.map((m) => {
        const isChecked = selected === m.id;
        const name = t(`purchase.methods.${m.id}.name`, { defaultValue: m.name });
        const description = t(`purchase.methods.${m.id}.description`, { defaultValue: m.description });
        return (
          <Card
            key={m.id}
            interactive
            selected={isChecked}
            className={styles.card}
            onClick={() => onSelect(m.id)}
            role="radio"
            aria-checked={isChecked}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(m.id)}
          >
            <div className={styles.iconWrap}>{methodIcons[m.icon]}</div>
            <div className={styles.info}>
              <div className={styles.name}>{name}</div>
              <div className={styles.desc}>{description}</div>
            </div>
            <div className={[styles.radio, isChecked ? styles.checked : ''].filter(Boolean).join(' ')}>
              <div className={styles.radioDot} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
