'use client';

import React, { useState, useMemo } from 'react';
import StatWidget from '@/components/StatWidget';
import SprintList from '@/components/SprintList';
import CreateTaskForm from '@/components/CreateTaskForm';
import DashboardAnalytics from '@/components/DashboardAnalytics';
import { Plus, Layout, Zap, AlertTriangle, Cpu, Users, Calendar, Info, RefreshCw } from 'lucide-react';
import { useProject } from '@/components/ProjectProvider';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { selectedProject, teams, tasks, loading, addTask, refreshData } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('📊 DashboardPage - selectedProject:', selectedProject);
  console.log('📊 DashboardPage - teams:', teams);
  console.log('📊 DashboardPage - tasks:', tasks);

  // Projeye dahil olan tüm ekipleri ve üyeleri bul
  const projectTeams = useMemo(() => 
    selectedProject ? teams.filter(t => selectedProject.teamIds.includes(t.id)) : [],
    [selectedProject, teams]
  );

  const allMembers = useMemo(() => 
    projectTeams.flatMap(t => t.members),
    [projectTeams]
  );

  // Seçili projeye ait taskleri filtrele
  const projectTasks = useMemo(() => {
    if (!selectedProject) return [];
    return tasks.filter(t => t.projectId === selectedProject.id);
  }, [selectedProject, tasks]);

  // Aktif sprintteki görevleri filtrele (sadece sprint 42 olanlar)
  const activeSprintTasks = useMemo(() => {
    if (!selectedProject) return [];
    return projectTasks.filter(t => t.sprintNumber === 42);
  }, [selectedProject, projectTasks]);

  const sprintInfo = useMemo(() => {
    if (!selectedProject) return null;
    return {
      sprintName: `Sprint ${selectedProject.sprintCount} - ${selectedProject.name} Geliştirme`,
      status: "Active",
      tasks: activeSprintTasks
    };
  }, [selectedProject, activeSprintTasks]);

  const stats = useMemo(() => {
    if (!selectedProject) return [];
    
    // Gerçek görev verilerini kullan
    const activeTasksCount = projectTasks.filter(t => t.status === 'In Progress').length;
    
    // Geciken işler: Priority 'High' olan ve henüz tamamlanmamış işler (basit mantık)
    const delayedTasksCount = projectTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
    
    return [
      { title: "Toplam Sprint", value: selectedProject.sprintCount, icon: <Zap />, color: "blue" as const },
      { title: "Aktif Görevler", value: activeTasksCount, icon: <Layout />, color: "indigo" as const },
      { title: "Geciken İşler", value: delayedTasksCount, icon: <AlertTriangle />, color: "red" as const },
      { title: "AI Risk Skoru", value: selectedProject.riskScore, isAiRisk: true, icon: <Cpu />, color: "yellow" as const },
    ];
  }, [selectedProject, projectTasks]);

  const handleTaskSubmit = async (data: any) => {
    if (selectedProject) {
      await addTask({
        title: data.title,
        assignee: data.assignee,
        priority: data.priority,
        status: 'Pending',
        projectId: selectedProject.id,
        storyPoints: Number(data.storyPoints), // Number'a çevir
        sprintNumber: data.sprintNumber
      });
    }
    setIsModalOpen(false); // Task eklendikten sonra kapat
  };

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
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-primary mb-1">
              <Layout size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Proje Paneli</h1>
            <p className="text-muted-foreground font-medium">Yapay Zeka Destekli Risk ve Gecikme Takip Sistemi</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={refreshData}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-secondary text-foreground rounded-xl font-bold border border-border hover:bg-accent transition-all duration-200"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              <span>Yenile</span>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={20} />
              <span>Yeni Görev Ekle</span>
            </button>
          </div>
        </header>

        {/* Project Info Section */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-primary">
                <Info size={18} />
                <h3 className="font-bold">Proje Hakkında</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedProject.description || "Bu proje için henüz bir açıklama girilmemiş."}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-indigo-500">
                <Users size={18} />
                <h3 className="font-bold">Görevli Ekipler</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {projectTeams.map(team => (
                  <div key={team.id} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-500/20">
                    {team.name}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">
                Toplam {allMembers.length} geliştirici görev alıyor.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-500">
                <Calendar size={18} />
                <h3 className="font-bold">Proje Takvimi</h3>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Başlangıç:</span>
                <span className="ml-2 font-bold text-foreground">{selectedProject.startDate}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Aktif Sprint:</span>
                <span className="ml-2 font-bold text-foreground">{selectedProject.sprintCount}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatWidget 
              key={i}
              title={stat.title} 
              value={stat.value} 
              icon={stat.icon}
              color={stat.color}
              isAiRisk={stat.isAiRisk}
            />
          ))}
        </div>

        {/* AI Analytics Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-bold text-foreground">AI Analitik Öngörüler</h2>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase">Canlı</span>
          </div>
          <DashboardAnalytics />
        </section>

        {/* Sprint Tracking Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-foreground">Sprint Takibi</h2>
              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AKTİF</span>
              </div>
            </div>
          </div>
          <SprintList 
            sprintName={sprintInfo?.sprintName || ''} 
            status={sprintInfo?.status || ''} 
            tasks={sprintInfo?.tasks || []} 
          />
        </section>

        {/* Task Creation Modal */}
        {isModalOpen && (
          <CreateTaskForm 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={handleTaskSubmit} 
          />
        )}
      </div>
    </div>
  );
}
