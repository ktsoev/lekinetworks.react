import { useTranslation } from 'react-i18next';
import type { PaymentMethod, Tariff } from '../../types';
import { Card } from '../ui/Card';
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter';
import styles from './PurchaseSummary.module.css';

interface PurchaseSummaryProps {
  tariff: Tariff;
  method: PaymentMethod;
}

export function PurchaseSummary({ tariff, method }: PurchaseSummaryProps) {
  const { t } = useTranslation();
  const formatPrice = useCurrencyFormatter();
  const methodName = t(`purchase.methods.${method}.name`);
  return (
    <Card elevated className={styles.card}>
      <span className={styles.title}>{t('purchase.summary.title')}</span>
      <div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('purchase.summary.plan')}</span>
          <span className={styles.rowValue}>{tariff.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('purchase.summary.devices')}</span>
          <span className={styles.rowValue}>{t('purchase.summary.devicesValue')}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('purchase.summary.paymentMethod')}</span>
          <span className={styles.rowValue}>{methodName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{t('purchase.summary.total')}</span>
          <span className={[styles.rowValue, styles.total].join(' ')}>
            {formatPrice(tariff)}
          </span>
        </div>
      </div>
    </Card>
  );
}
