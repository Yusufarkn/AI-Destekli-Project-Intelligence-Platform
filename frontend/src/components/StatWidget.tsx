'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'indigo' | 'red' | 'yellow' | 'green';
  isAiRisk?: boolean;
}

const StatWidget: React.FC<StatWidgetProps> = ({ title, value, icon, color, isAiRisk }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const colorMap = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    yellow: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
  };

  if (!mounted) {
    return <div className="bg-card border border-border rounded-2xl p-6 h-[140px] animate-pulse" />;
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl transition-colors duration-300", colorMap[color])}>
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) 
            : icon}
        </div>
        {isAiRisk && (
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:translate-x-1 transition-transform duration-300">
          {value}
        </h3>
      </div>
    </div>
  );
};

export default StatWidget;
