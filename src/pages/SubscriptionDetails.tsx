import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { SubscriptionsService } from '../api/subscriptions';
import { TariffsService } from '../api/tariffs';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Loader';
import { SubscriptionLink } from '../components/subscription/SubscriptionLink';
import { formatDate, getDaysRemaining } from '../utils/format';
import styles from './SubscriptionDetails.module.css';

export function SubscriptionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const keyId = id ?? '';

  const { data: tariffs = [], isPending: tariffsLoading } = useQuery({
    queryKey: queryKeys.tariffs,
    queryFn: () => TariffsService.list(),
  });

  const { data: sub, isPending: subLoading, isError } = useQuery({
    queryKey: queryKeys.subscription(keyId),
    queryFn: () => SubscriptionsService.get(keyId),
    enabled: Boolean(id) && isAuthenticated,
  });

  useEffect(() => {
    if (isError) navigate('/dashboard', { replace: true });
  }, [isError, navigate]);

  const loading = subLoading || tariffsLoading;

  if (loading) {
    return (
      <div className={styles.page}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!sub) return null;

  const tariff = sub.tariffId ? tariffs.find((tar) => tar.id === sub.tariffId) : undefined;
  const daysLeft = getDaysRemaining(sub.expiresAt);
  const planTitle = tariff?.name || sub.tariffId || 'VPN';

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
        ← {t('common.actions.back')}
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.card.plan', { name: planTitle })}</h1>
        <Badge status={sub.status} />
      </div>

      <div className={styles.cards}>
        <Card className={styles.card}>
          <span className={styles.cardTitle}>{t('subscription.details.status')}</span>
          <div className={styles.statusRow}>
            <Badge status={sub.status} />
            {sub.status === 'active' && (
              <span className={styles.statusDetail}>{t('subscription.details.daysLeft', { count: daysLeft })}</span>
            )}
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>{t('subscription.details.expiresLabel')}</span>
            <span className={styles.metaValueNormal}>{formatDate(sub.expiresAt)}</span>
          </div>
        </Card>

        <Card className={styles.card}>
          <SubscriptionLink url={sub.subscriptionLink} />
        </Card>

        <Card className={styles.card}>
          <span className={styles.cardTitle}>{t('subscription.details.extend.title')}</span>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {t('subscription.details.extend.desc')}
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              sub.status === 'active'
                ? navigate(`/dashboard/renew/${sub.id}`)
                : navigate('/dashboard/purchase', {
                    state: tariff ? { tariff } : undefined,
                  })
            }
          >
            {sub.status === 'active' ? t('renew.nav') : t('common.actions.extend')}
          </Button>
        </Card>

        <Card className={styles.card}>
          <span className={styles.cardTitle}>{t('subscription.details.metadata.title')}</span>
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{t('subscription.details.metadata.id')}</span>
              <span className={styles.metaValue}>{sub.id}</span>
            </div>
            {sub.createdAt && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>{t('subscription.details.metadata.created')}</span>
                <span className={styles.metaValueNormal}>{formatDate(sub.createdAt)}</span>
              </div>
            )}
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>{t('subscription.details.metadata.plan')}</span>
              <span className={styles.metaValueNormal}>{planTitle}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
