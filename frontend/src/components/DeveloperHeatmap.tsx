'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from 'next-themes';
import { Users } from 'lucide-react';

interface DeveloperHeatmapProps {
  data?: any[];
}

const DEFAULT_HEATMAP_DATA = [
  { name: 'Ahmet', workload: 85, efficiency: 92 },
  { name: 'Ayşe', workload: 65, efficiency: 88 },
  { name: 'Mehmet', workload: 95, efficiency: 75 },
  { name: 'Zeynep', workload: 45, efficiency: 95 },
  { name: 'Can', workload: 75, efficiency: 82 },
];

const DeveloperHeatmap: React.FC<DeveloperHeatmapProps> = ({ data: externalData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = (externalData && externalData.length > 0) 
    ? externalData 
    : DEFAULT_HEATMAP_DATA;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Users className="text-emerald-500" size={18} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Geliştirici İş Yükü & Verimlilik</h3>
            <p className="text-xs text-muted-foreground">Takım bazlı performans analizi</p>
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
              cursor={{ fill: isDark ? '#1E293B' : '#F8FAFC' }}
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
            <Bar 
              dataKey="workload" 
              name="İş Yükü (%)" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Bar 
              dataKey="efficiency" 
              name="Verimlilik (%)" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeveloperHeatmap;
