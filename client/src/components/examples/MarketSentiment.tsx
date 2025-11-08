import MarketSentiment from '../MarketSentiment';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function MarketSentimentExample() {
  const data = [
    { label: 'Now', value: 25, sentiment: 'Extreme Fear' },
    { label: 'Yesterday', value: 24, sentiment: 'Extreme Fear' },
    { label: 'Last Week', value: 83, sentiment: 'Extreme Greed' },
  ];

  return (
    <LanguageProvider>
      <MarketSentiment data={data} />
    </LanguageProvider>
  );
}
