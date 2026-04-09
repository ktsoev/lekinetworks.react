import type { SubscriptionStatus } from '../../types';
import styles from './Badge.module.css';

interface BadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

const labels: Record<SubscriptionStatus, string> = {
  active: 'Active',
  expired: 'Expired',
  pending: 'Pending',
};

export function Badge({ status, className }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[status], className ?? ''].filter(Boolean).join(' ')}>
      <span className={styles.dot} aria-hidden />
      {labels[status]}
    </span>
  );
}
