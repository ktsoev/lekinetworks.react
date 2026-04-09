import styles from './DeviceCounter.module.css';

interface DeviceCounterProps {
  connected: number;
  limit: number;
}

export function DeviceCounter({ connected, limit }: DeviceCounterProps) {
  const pct = limit > 0 ? (connected / limit) * 100 : 0;
  const isFull = connected >= limit;

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <span className={styles.label}>Connected Devices</span>
        <span className={styles.count}>{connected} of {limit}</span>
      </div>
      <div className={styles.track} role="progressbar" aria-valuenow={connected} aria-valuemax={limit}>
        <div
          className={[styles.fill, isFull ? styles.full : ''].filter(Boolean).join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
