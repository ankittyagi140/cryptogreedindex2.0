import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChartDataPoint {
  date: string;
  fear: number;
  price: number;
}

interface FearGreedChartProps {
  data: ChartDataPoint[];
}

export default function FearGreedChart({ data }: FearGreedChartProps) {
  const { t } = useLanguage();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  const handleDownload = () => {
    console.log('Download chart data');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-card-border rounded-md p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-green-500">
            Greed: ${payload[1]?.value?.toLocaleString()}
          </p>
          <p className="text-sm text-blue-500">
            Price: ${payload[0]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <Card className="p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="font-display text-3xl font-semibold">{t('chart')}</h2>
          <div className="flex items-center gap-3">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="w-32" data-testid="select-crypto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">🪙 BTC</SelectItem>
                <SelectItem value="ETH">💎 ETH</SelectItem>
                <SelectItem value="SOL">☀️ SOL</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleDownload} data-testid="button-download-chart">
              <Download className="h-4 w-4 mr-2" />
              {t('download')}
            </Button>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorFear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="fear"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorFear)"
                name="Greed"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="Price"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
