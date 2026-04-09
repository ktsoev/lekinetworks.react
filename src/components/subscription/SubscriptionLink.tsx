import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import styles from './SubscriptionLink.module.css';

interface SubscriptionLinkProps {
  url: string;
}

export function SubscriptionLink({ url }: SubscriptionLinkProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast(t('subscription.link.copied'), 'success');
    } catch {
      toast(t('subscription.link.copyFailed'), 'error');
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{t('subscription.details.panel.title')}</h3>
      <p className={styles.desc}>
        {t('subscription.details.panel.desc')}
      </p>
      <div className={styles.url}>
        <span className={styles.urlText}>{url}</span>
      </div>
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
        >
          {t('common.actions.openPanel')}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {t('common.actions.copyLink')}
        </Button>
      </div>
    </div>
  );
}
