import { useCallback } from 'react';
import { translations, Language } from '../translations';

export const useTranslations = (language: Language) => {
  const t = useCallback(
    (key: keyof typeof translations): string => {
      return translations[key]?.[language] || (key as string);
    },
    [language]
  );

  return { t };
};
