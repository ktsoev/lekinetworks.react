import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react';
import styles from './CodeInput.module.css';

const LENGTH = 6;

interface CodeInputProps {
  onComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CodeInput({ onComplete, error, disabled }: CodeInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [shake, setShake] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }

    if (next.every(Boolean)) {
      const code = next.join('');
      onComplete(code);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (pasted.length === 0) return;
    const next = [...digits];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    refs.current[focusIndex]?.focus();
    if (next.every(Boolean)) onComplete(next.join(''));
  };

  if (error && !shake) triggerShake();

  return (
    <div className={styles.wrapper}>
      <div className={[styles.boxes, shake ? styles.shake : ''].filter(Boolean).join(' ')}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className={[styles.box, d ? styles.filled : ''].filter(Boolean).join(' ')}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={d}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            autoFocus={i === 0}
          />
        ))}
      </div>
      {error && <span className={styles.error} role="alert">{error}</span>}
    </div>
  );
}
