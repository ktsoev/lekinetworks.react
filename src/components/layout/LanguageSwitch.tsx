import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitch.module.css';

const langs = ['en', 'ru'] as const;

export function LanguageSwitch() {
  const { i18n, t } = useTranslation();
  const current = i18n.language.split('-')[0];

  return (
    <div className={styles.wrap} role="group" aria-label="Language">
      {langs.map((lang) => (
        <button
          key={lang}
          className={[styles.btn, current === lang ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => i18n.changeLanguage(lang)}
          aria-pressed={current === lang}
          aria-label={t(`common.language.${lang}`)}
        >
          {t(`common.language.${lang}`)}
        </button>
      ))}
    </div>
  );
}
