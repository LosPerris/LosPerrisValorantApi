import { useStore } from '@nanostores/react';
import { lang, translations } from '../store/appStore';

export function useTranslations() {
  const currentLang = useStore(lang);
  
  return function t(key: string): string {
    return translations[currentLang]?.[key] || key;
  };
}
