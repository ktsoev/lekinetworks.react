import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Subscription } from '../types';
import { queryKeys } from '../api/queryKeys';
import { SubscriptionsService } from '../api/subscriptions';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { formatDate } from '../utils/format';
import { CHECKOUT_HINT_KEY, PAYMENT_SUCCESS_REDIRECT_DELAY_MS } from '../utils/constants';
import styles from './PaymentSuccess.module.css';

interface CheckoutHint {
  planKey: string;
  planName: string;
  durationDays: number;
}

function pickHighlightSubscription(subs: Subscription[]): Subscription | null {
  const active = subs.filter((s) => s.status === 'active');
  if (!active.length) return null;
  return [...active].sort(
    (a, b) => new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime(),
  )[0];
}

export function PaymentSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptions = [] } = useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: () => SubscriptionsService.list(),
    enabled: isAuthenticated,
  });
  const [hint, setHint] = useState<CheckoutHint | null>(null);
  const [countdown, setCountdown] = useState(Math.round(PAYMENT_SUCCESS_REDIRECT_DELAY_MS / 1000));

  useEffect(() => {
    const raw = sessionStorage.getItem(CHECKOUT_HINT_KEY);
    if (raw) {
      try {
        setHint(JSON.parse(raw) as CheckoutHint);
      } catch {
        /* ignore */
      }
      sessionStorage.removeItem(CHECKOUT_HINT_KEY);
    }
    void queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
  }, [queryClient]);

  const highlight = pickHighlightSubscription(subscriptions);

  useEffect(() => {
    const timer = setTimeout(
      () => navigate('/dashboard', { replace: true }),
      PAYMENT_SUCCESS_REDIRECT_DELAY_MS,
    );
    const interval = setInterval(() => setCountdown((s) => Math.max(0, s - 1)), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className={styles.page}>
      <svg className={styles.checkmark} viewBox="0 0 88 88">
        <circle className={styles.circle} cx="44" cy="44" r="42" />
        <path className={styles.check} d="M25 44l13 13 25-25" />
      </svg>

      <h1 className={styles.title}>{t('payment.success.title')}</h1>

      <div className={styles.summary}>
        {hint?.planName && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{t('payment.success.plan')}</span>
            <span className={styles.summaryValue}>{hint.planName}</span>
          </div>
        )}
        {highlight && (
          <>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('payment.success.expires')}</span>
              <span className={styles.summaryValue}>{formatDate(highlight.expiresAt)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>{t('payment.success.devices')}</span>
              <span className={styles.summaryValue}>
                {t('payment.success.devicesValue', { limit: highlight.deviceLimit })}
              </span>
            </div>
          </>
        )}
      </div>

      <div className={styles.actions}>
        {highlight && (
          <Button onClick={() => navigate(`/dashboard/subscription/${highlight.id}`)}>
            {t('common.actions.viewSubscription')}
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          {t('common.actions.goToDashboard')}
        </Button>
      </div>

      <p className={styles.redirect}>{t('payment.success.redirecting', { seconds: countdown })}</p>
    </div>
  );
}
