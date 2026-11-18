import { useStore } from '@nanostores/react';
import { lang } from '../../store/appStore';
import { cn } from '../../utils/cn';

export default function LanguageToggle() {
  const currentLang = useStore(lang);

  return (
    <div className="fixed top-4 right-4 md:right-6 flex items-center gap-1 z-50 text-xs font-semibold">
      <button
        type="button"
        onClick={() => lang.set('es')}
        className={cn(
          'px-1.5 py-1 transition-colors cursor-pointer',
          currentLang === 'es' ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'
        )}
      >
        ES
      </button>
      <span className="text-neutral-700">/</span>
      <button
        type="button"
        onClick={() => lang.set('en')}
        className={cn(
          'px-1.5 py-1 transition-colors cursor-pointer',
          currentLang === 'en' ? 'text-[#ff4655]' : 'text-neutral-500 hover:text-white'
        )}
      >
        EN
      </button>
    </div>
  );
}
