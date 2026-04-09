import styles from './Loader.module.css';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, size !== 'md' ? styles[size] : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return <div className={styles.skeletonLine} style={{ width }} />;
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <SkeletonLine width="40%" />
      <SkeletonLine width="60%" />
      <SkeletonLine width="30%" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className={styles.pageLoader}>
      <Spinner size="lg" />
    </div>
  );
}
