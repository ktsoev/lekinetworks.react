import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCountdown } from '../hooks/useCountdown';
import { CodeInput } from '../components/ui/CodeInput';
import { Spinner } from '../components/ui/Loader';
import { CODE_EXPIRY_SECONDS } from '../utils/constants';
import styles from './Verify.module.css';

export function Verify() {
  const { pendingEmail, verifyCode, sendCode } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const { seconds, isExpired, restart } = useCountdown(CODE_EXPIRY_SECONDS);

  if (!pendingEmail) return <Navigate to="/auth/login" replace />;

  const handleComplete = async (code: string) => {
    setCodeError('');
    setLoading(true);
    try {
      await verifyCode(pendingEmail, code);
      navigate('/dashboard', { replace: true });
    } catch {
      setCodeError(t('auth.verify.invalidCode'));
      toast(t('auth.verify.invalidToast'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendCode(pendingEmail);
      restart();
      toast(t('auth.verify.newCodeSent'), 'success');
    } catch {
      toast(t('auth.verify.resendFailed'), 'error');
    }
  };

  return (
    <>
      <h1 className={styles.heading}>{t('auth.verify.heading')}</h1>
      <p className={styles.sub}>
        {t('auth.verify.sub', { email: '' })}
        <span className={styles.email}>{pendingEmail}</span>
      </p>

      <div className={styles.codeWrap}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <Spinner />
          </div>
        ) : (
          <CodeInput onComplete={handleComplete} error={codeError} disabled={loading} />
        )}
      </div>

      <div className={styles.countdown}>
        {isExpired ? (
          <button className={styles.resend} onClick={handleResend}>
            {t('common.actions.resendCode')}
          </button>
        ) : (
          t('auth.verify.resendIn', { seconds })
        )}
      </div>

      <Link to="/auth/login" className={styles.changeEmail}>
        {t('common.actions.useDifferentEmail')}
      </Link>
    </>
  );
}
