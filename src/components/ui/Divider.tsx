import styles from './Divider.module.css';

interface DividerProps {
  label?: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <div className={styles.divider}>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
