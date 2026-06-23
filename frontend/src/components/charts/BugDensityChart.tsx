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
  Cell
} from 'recharts';
import { useTheme } from 'next-themes';

interface BugDensityChartProps {
  data: any[];
}

const BugDensityChart: React.FC<BugDensityChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Default fallback data if no data is provided
  const chartData = data && data.length > 0 ? data : [
    { developer: 'Ahmet', bugs: 3 },
    { developer: 'Ayşe', bugs: 2 },
    { developer: 'Mehmet', bugs: 5 },
  ];

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDark ? '#334155' : '#E2E8F0'} 
          />
          <XAxis 
            dataKey="developer" 
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
          <Bar 
            dataKey="bugs" 
            name="Bug Sayısı"
            radius={[6, 6, 0, 0]}
            barSize={30}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.bugs > 5 ? '#EF4444' : '#F59E0B'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BugDensityChart;
