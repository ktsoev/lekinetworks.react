import { useToast } from '../../context/ToastContext';
import type { Toast as ToastType } from '../../types';
import styles from './Toast.module.css';

const icons = {
  success: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { dismiss } = useToast();
  return (
    <div className={[styles.toast, styles[toast.type]].join(' ')} role="alert" aria-live="polite">
      {icons[toast.type]}
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.close} onClick={() => dismiss(toast.id)} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div className={styles.container} aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
