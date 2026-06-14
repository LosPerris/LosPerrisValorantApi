import { useStore } from '@nanostores/react';
import { lang } from '../../store/appStore';
import { cn } from '../../utils/cn';

export default function LanguageToggle() {
  const currentLang = useStore(lang);

  return (
    <div className="fixed top-4 right-4 md:right-8 flex bg-[#0a0a0d] border border-[#2a2a30] p-1 rounded-lg z-50 shadow-lg">
      <button 
        onClick={() => lang.set('es')} 
        className={cn(
          "px-3 py-1.5 rounded-md font-bold text-xs transition-colors cursor-pointer",
          currentLang === 'es' ? "bg-[#ff4655] text-white" : "text-neutral-400 hover:text-white"
        )}
      >
        ES
      </button>
      <button 
        onClick={() => lang.set('en')} 
        className={cn(
          "px-3 py-1.5 rounded-md font-bold text-xs transition-colors cursor-pointer",
          currentLang === 'en' ? "bg-[#ff4655] text-white" : "text-neutral-400 hover:text-white"
        )}
      >
        EN
      </button>
    </div>
  );
}
