import FearGreedGauge from '../FearGreedGauge';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function FearGreedGaugeExample() {
  return (
    <LanguageProvider>
      <FearGreedGauge value={25} lastUpdated="Nov 8, 2025" />
    </LanguageProvider>
  );
}
