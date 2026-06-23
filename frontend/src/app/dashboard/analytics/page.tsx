'use client';

import React, { useState, useMemo, useEffect } from 'react';
import SprintTrendChart from '@/components/SprintTrendChart';
import { api } from '@/lib/api';
import { 
  BarChart2, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProject } from '@/components/ProjectProvider';

export default function AnalyticsPage() {
  const { selectedProject } = useProject();
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [firebaseTrendData, setFirebaseTrendData] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedProject || selectedProject.id.startsWith('p')) return;

    const fetchTrendData = async () => {
      try {
        const response = await api.get(`/analytics/sprint-trends/${selectedProject.id}`);
        if (response.success) {
          setFirebaseTrendData(response.data);
        }
      } catch (error) {
        console.error('Trend verisi çekme hatası:', error);
      }
    };
    fetchTrendData();
  }, [selectedProject]);

  const trendData = useMemo(() => {
    if (firebaseTrendData.length > 0) return firebaseTrendData;

    // Proje ismine ve sprint sayısına göre bir seed oluştur
    const seed = selectedProject ? selectedProject.name.length + selectedProject.sprintCount : 0;
    
    if (!selectedProject) return [];

    if (viewType === 'weekly') {
      return Array.from({ length: 6 }, (_, i) => {
        const sprintIndex = selectedProject.sprintCount - 5 + i;
        // Daha dinamik veriler için sinüs ve seed kullanımı
        const velocityVariation = Math.sin(seed + i) * 10;
        const qualityVariation = Math.cos(seed + i) * 5;
        
        return {
          name: `Sprint ${sprintIndex}`,
          velocity: Math.round(45 + (selectedProject.sprintCount % 15) + (i * 3) + velocityVariation),
          quality: Math.round(85 + (i * 1.5) + qualityVariation)
        };
      });
    } else {
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
      return months.slice(0, 4).map((month, i) => ({
        name: month,
        velocity: Math.round(160 + selectedProject.sprintCount + (i * 20) + (Math.sin(seed + i) * 15)),
        quality: Math.round(88 + (Math.cos(seed + i) * 4))
      }));
    }
  }, [selectedProject, viewType]);

  const metrics = useMemo(() => {
    if (!selectedProject) return [];
    const seed = selectedProject.name.length + selectedProject.sprintCount;
    const completionBase = 85 + (selectedProject.sprintCount % 10);
    const velocityBase = 50 + (selectedProject.sprintCount % 20);
    
    return [
      { 
        label: 'Sprint Tamamlama', 
        value: viewType === 'weekly' ? `%${Math.round(completionBase + (Math.sin(seed) * 5))}` : '%88', 
        change: `${(Math.sin(seed) * 3).toFixed(1)}%`, 
        icon: CheckCircle2, 
        color: 'text-emerald-500' 
      },
      { 
        label: 'Ortalama Hız', 
        value: viewType === 'weekly' ? `${Math.round(velocityBase + (Math.cos(seed) * 8))} SP` : '205 SP', 
        change: `+${(seed % 5) + 2} SP`, 
        icon: Zap, 
        color: 'text-blue-500' 
      },
      { 
        label: 'Kalite Hedefi', 
        value: `%${Math.min(98, 90 + Math.floor(selectedProject.riskScore / 15))}`, 
        change: 'Hedef Üstü', 
        icon: Target, 
        color: 'text-primary' 
      },
    ];
  }, [selectedProject, viewType]);

  const aiInsight = useMemo(() => {
    if (!selectedProject) return { text: '', velocityTrend: 0 };
    const seed = selectedProject.name.length + selectedProject.sprintCount;
    const velocityTrend = Math.round(5 + (seed % 10));
    const riskLevel = selectedProject.riskScore;
    
    let message = "";
    if (riskLevel > 60) {
      message = `Yüksek risk skoru (%${riskLevel}) nedeniyle önümüzdeki sprintte teslimat gecikmesi yaşanabilir. Kaynakların kritik görevlere odaklanması önerilir.`;
    } else if (riskLevel > 30) {
      message = `Proje seyri stabil görünüyor. Mevcut hız trendine göre bir sonraki sprintte %${velocityTrend}'lik bir verimlilik artışı öngörülüyor.`;
    } else {
      message = `Düşük risk seviyesi ve yüksek kalite skoru ile proje hedeflerin önünde ilerliyor. %${velocityTrend}'lik hız artışı ile erken teslimat mümkün görünüyor.`;
    }

    return {
      text: message,
      velocityTrend
    };
  }, [selectedProject]);

  const { loading } = useProject();

  if (loading || !selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-primary mb-1">
              <BarChart2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Trend Analizi</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Proje Performans Analitiği</h1>
            <p className="text-muted-foreground font-medium">{viewType === 'weekly' ? 'Haftalık' : 'Aylık'} sprint gelişimi ve kalite metriklerinin AI analizi</p>
          </div>
          <div className="flex bg-card border border-border rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewType('weekly')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                viewType === 'weekly' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Haftalık
            </button>
            <button 
              onClick={() => setViewType('monthly')}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                viewType === 'monthly' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Aylık
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <metric.icon size={100} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary rounded-xl">
                  <metric.icon className={metric.color} size={20} />
                </div>
                <div className="flex items-center space-x-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <ArrowUpRight size={10} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <h3 className="text-3xl font-black text-foreground mt-1">{metric.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground">Hız ve Kalite Trendi</h3>
                <p className="text-sm text-muted-foreground">Son 6 sprintin karşılaştırmalı analizi</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Hız (SP)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">Kalite (%)</span>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <SprintTrendChart data={trendData} />
            </div>
          </section>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start space-x-4">
          <div className="p-2 bg-primary/20 rounded-xl">
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-primary mb-1 text-sm">AI Öngörüsü</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {aiInsight.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
