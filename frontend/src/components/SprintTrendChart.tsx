'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from 'next-themes';
import { TrendingUp } from 'lucide-react';

interface SprintTrendChartProps {
  data?: any[];
  simple?: boolean;
}

const DEFAULT_SPRINT_DATA = [
  { name: 'Sprint 1', velocity: 45, quality: 90 },
  { name: 'Sprint 2', velocity: 52, quality: 85 },
  { name: 'Sprint 3', velocity: 48, quality: 88 },
  { name: 'Sprint 4', velocity: 61, quality: 92 },
  { name: 'Sprint 5', velocity: 55, quality: 90 },
  { name: 'Sprint 6', velocity: 67, quality: 94 },
];

const SprintTrendChart: React.FC<SprintTrendChartProps> = ({ data: externalData, simple = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = (externalData && externalData.length > 0) 
    ? [...DEFAULT_SPRINT_DATA, ...externalData] 
    : DEFAULT_SPRINT_DATA;

  const ChartContent = () => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={isDark ? '#334155' : '#E2E8F0'} 
        />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11, fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#E2E8F0',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          verticalAlign="top" 
          align="right"
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '20px' }}
        />
        <Area 
          type="monotone" 
          dataKey="velocity" 
          name="Hız (SP)"
          stroke="#3B82F6" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorVelocity)" 
        />
        <Area 
          type="monotone" 
          dataKey="quality" 
          name="Kalite (%)"
          stroke="#10B981" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorQuality)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (simple) {
    return (
      <div className="h-full min-h-[300px] w-full">
        <ChartContent />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-8">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <TrendingUp className="text-blue-500" size={18} />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Sprint Hız & Kalite Trendi</h3>
          <p className="text-xs text-muted-foreground">Zaman içindeki performans gelişimi</p>
        </div>
      </div>

      <div className="flex-1 min-h-[350px] w-full">
        <ChartContent />
      </div>
    </div>
  );
};

export default SprintTrendChart;
