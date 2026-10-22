import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', showIcon = true }) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'PT', flag: '🇲🇿' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
  ];

  return (
    <div className={`flex items-center gap-1 bg-[#fffdfa]/95 p-1 rounded-xl border-2 border-amber-900/30 shadow-xs ${className}`}>
      {showIcon && <Globe className="w-3.5 h-3.5 text-amber-900 ml-1 mr-0.5" />}
      <div className="flex items-center gap-0.5">
        {languages.map(item => {
          const isActive = language === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              aria-label={`Selecionar idioma ${item.label}`}
              className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-amber-950 text-amber-100 shadow-xs scale-102'
                  : 'text-amber-950/80 hover:text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
