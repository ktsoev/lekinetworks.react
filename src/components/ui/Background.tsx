import styles from './Background.module.css';

export function Background() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.blob + ' ' + styles.blob1} />
      <div className={styles.blob + ' ' + styles.blob2} />
      <div className={styles.blob + ' ' + styles.blob3} />
    </div>
  );
}
