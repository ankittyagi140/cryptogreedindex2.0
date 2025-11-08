import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    pt: string;
  };
}

const translations: Translations = {
  title: {
    en: 'Crypto Fear and Greed Index',
    es: 'Índice de Miedo y Codicia Cripto',
    pt: 'Índice de Medo e Ganância Cripto',
  },
  description: {
    en: 'Crypto Fear and Greed Index is based on volatility, social media sentiments, surveys, market momentum, and more.',
    es: 'El Índice de Miedo y Codicia Cripto se basa en volatilidad, sentimientos en redes sociales, encuestas, momentum del mercado y más.',
    pt: 'O Índice de Medo e Ganância Cripto é baseado em volatilidade, sentimentos de mídia social, pesquisas, momentum de mercado e mais.',
  },
  marketSentiment: {
    en: 'Market Sentiment',
    es: 'Sentimiento del Mercado',
    pt: 'Sentimento do Mercado',
  },
  now: {
    en: 'Now',
    es: 'Ahora',
    pt: 'Agora',
  },
  yesterday: {
    en: 'Yesterday',
    es: 'Ayer',
    pt: 'Ontem',
  },
  lastWeek: {
    en: 'Last Week',
    es: 'Última Semana',
    pt: 'Última Semana',
  },
  extremeFear: {
    en: 'Extreme Fear',
    es: 'Miedo Extremo',
    pt: 'Medo Extremo',
  },
  fear: {
    en: 'Fear',
    es: 'Miedo',
    pt: 'Medo',
  },
  neutral: {
    en: 'Neutral',
    es: 'Neutral',
    pt: 'Neutro',
  },
  greed: {
    en: 'Greed',
    es: 'Codicia',
    pt: 'Ganância',
  },
  extremeGreed: {
    en: 'Extreme Greed',
    es: 'Codicia Extrema',
    pt: 'Ganância Extrema',
  },
  chart: {
    en: 'Crypto Fear and Greed Chart',
    es: 'Gráfico de Miedo y Codicia Cripto',
    pt: 'Gráfico de Medo e Ganância Cripto',
  },
  download: {
    en: 'Download',
    es: 'Descargar',
    pt: 'Baixar',
  },
  lastUpdated: {
    en: 'Last Updated',
    es: 'Última Actualización',
    pt: 'Última Atualização',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
