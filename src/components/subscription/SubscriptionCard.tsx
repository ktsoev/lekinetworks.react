import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Subscription, Tariff } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatDateShort, getDaysRemaining } from '../../utils/format';
import styles from './SubscriptionCard.module.css';

interface SubscriptionCardProps {
  subscription: Subscription;
  tariff?: Tariff;
}

export function SubscriptionCard({ subscription, tariff }: SubscriptionCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const daysLeft = getDaysRemaining(subscription.expiresAt);
  const isActive = subscription.status === 'active';

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {t('dashboard.card.plan', { name: tariff?.name || subscription.tariffId || 'VPN' })}
        </h3>
        <Badge status={subscription.status} />
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
          </svg>
          {isActive
            ? t('dashboard.card.expires', { date: formatDateShort(subscription.expiresAt), days: daysLeft })
            : t('dashboard.card.expiredOn', { date: formatDateShort(subscription.expiresAt) })}
        </div>

      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/dashboard/subscription/${subscription.id}`)}
        >
          {t('common.actions.manage')}
        </Button>
      </div>
    </Card>
  );
}
