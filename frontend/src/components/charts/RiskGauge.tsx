'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const { theme } = useTheme();
  
  const data = [
    { name: 'Risk', value: score },
    { name: 'Safe', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s <= 30) return '#10B981'; // emerald-500
    if (s <= 70) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-500
  };

  const COLORS = [getColor(score), theme === 'dark' ? '#1E293B' : '#F1F5F9'];

  return (
    <div className="w-full h-full min-h-[180px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius="65%"
            outerRadius="90%"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index]} 
                className="transition-all duration-500"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskGauge;
