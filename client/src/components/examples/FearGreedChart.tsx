import FearGreedChart from '../FearGreedChart';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function FearGreedChartExample() {
  const data = [
    { date: 'Dec 2024', fear: 75, price: 95000 },
    { date: 'Jan 2025', fear: 50, price: 98000 },
    { date: 'Feb 2025', fear: 40, price: 105000 },
    { date: 'Mar 2025', fear: 30, price: 110000 },
    { date: 'Apr 2025', fear: 25, price: 115000 },
    { date: 'May 2025', fear: 35, price: 108000 },
    { date: 'Jun 2025', fear: 45, price: 112000 },
    { date: 'Jul 2025', fear: 60, price: 118000 },
    { date: 'Aug 2025', fear: 70, price: 122000 },
    { date: 'Sep 2025', fear: 85, price: 125000 },
    { date: 'Oct 2025', fear: 65, price: 120000 },
    { date: 'Nov 2025', fear: 27, price: 126000 },
  ];

  return (
    <LanguageProvider>
      <FearGreedChart data={data} />
    </LanguageProvider>
  );
}
