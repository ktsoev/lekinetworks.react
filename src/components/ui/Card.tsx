import type { HTMLAttributes } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  elevated?: boolean;
  interactive?: boolean;
}

export function Card({
  selected,
  elevated,
  interactive,
  className,
  children,
  ...props
}: CardProps) {
  const classes = [
    styles.card,
    interactive ? styles.interactive : '',
    selected ? styles.selected : '',
    elevated ? styles.elevated : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
