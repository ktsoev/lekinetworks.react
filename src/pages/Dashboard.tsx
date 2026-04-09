import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion';
import { queryKeys } from '../api/queryKeys';
import { SubscriptionsService } from '../api/subscriptions';
import { TariffsService } from '../api/tariffs';
import { useAuth } from '../context/AuthContext';
import { SubscriptionCard } from '../components/subscription/SubscriptionCard';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Loader';
import styles from './Dashboard.module.css';

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: subscriptions = [], isPending: subsLoading } = useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: () => SubscriptionsService.list(),
    enabled: isAuthenticated,
  });

  const { data: tariffs = [] } = useQuery({
    queryKey: queryKeys.tariffs,
    queryFn: () => TariffsService.list(),
  });
  const { t } = useTranslation();

  const tariffMap = Object.fromEntries(tariffs.map((tar) => [tar.id, tar]));

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.title')}</h1>
        <Button onClick={() => navigate('/dashboard/purchase')}>{t('common.actions.buySubscription')}</Button>
      </div>

      {subsLoading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className={styles.empty}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className={styles.emptyTitle}>{t('dashboard.empty.title')}</h2>
          <p className={styles.emptyDesc}>{t('dashboard.empty.desc')}</p>
          <Button onClick={() => navigate('/dashboard/purchase')}>{t('common.actions.buySubscription')}</Button>
        </div>
      ) : (
        <motion.div className={styles.grid} variants={listVariants} initial="hidden" animate="visible">
          {subscriptions.map((sub) => (
            <motion.div key={sub.id} variants={cardVariants}>
              <SubscriptionCard subscription={sub} tariff={tariffMap[sub.tariffId] ?? undefined} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
