'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DeveloperHeatmap from '@/components/DeveloperHeatmap';
import { 
  Users, 
  UserPlus, 
  Activity, 
  BarChart, 
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Shield,
  Layout,
  RefreshCw
} from 'lucide-react';
import { useProject } from '@/components/ProjectProvider';

const DEFAULT_DEVELOPERS = [
  { name: 'Zeynep', role: 'Frontend Lead', level: 'Senior', tasks: 12, workload: 45, efficiency: 95, status: 'Müsait', color: 'text-emerald-500', bg: 'bg-emerald-500/10', teamId: 't1' },
  { name: 'Ahmet', role: 'Backend Dev', level: 'Mid', tasks: 8, workload: 85, efficiency: 85, status: 'Meşgul', color: 'text-blue-500', bg: 'bg-blue-500/10', teamId: 't2' },
  { name: 'Ayşe', role: 'UI/UX Designer', level: 'Senior', tasks: 5, workload: 65, efficiency: 92, status: 'Müsait', color: 'text-purple-500', bg: 'bg-purple-500/10', teamId: 't2' },
  { name: 'Mehmet', role: 'Full Stack', level: 'Mid', tasks: 15, workload: 95, efficiency: 78, status: 'Aşırı Yüklü', color: 'text-red-500', bg: 'bg-red-500/10', teamId: 't3' },
  { name: 'Ali', role: 'QA Engineer', level: 'Junior', tasks: 4, workload: 35, efficiency: 88, status: 'Müsait', color: 'text-emerald-500', bg: 'bg-emerald-500/10', teamId: 't3' },
  { name: 'Veli', role: 'DevOps', level: 'Senior', tasks: 7, workload: 75, efficiency: 91, status: 'Müsait', color: 'text-emerald-500', bg: 'bg-emerald-500/10', teamId: 't3' },
  { name: 'Selin', role: 'Frontend Dev', level: 'Junior', tasks: 6, workload: 60, efficiency: 84, status: 'Müsait', color: 'text-emerald-500', bg: 'bg-emerald-500/10', teamId: 't3' },
];

export default function DevelopersPage() {
  const { teams, addTeam, addMemberToTeam, loading, refreshData } = useProject();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  
  // Firebase'den gelen üyeleri DEFAULT_DEVELOPERS ile birleştir
  const developers = useMemo(() => {
    const firebaseDevs = teams.flatMap(team => 
      team.members.map(member => ({
        name: member,
        role: 'Geliştirici',
        level: 'Junior',
        tasks: 0,
        workload: 0,
        efficiency: 100,
        status: 'Yeni',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        teamId: team.id
      }))
    ).filter(fDev => !DEFAULT_DEVELOPERS.some(dDev => dDev.name === fDev.name));

    return [...DEFAULT_DEVELOPERS, ...firebaseDevs];
  }, [teams]);

  const [newDev, setNewDev] = useState({ name: '', role: 'Developer', level: 'Junior', teamId: '' });

  // Modal açıldığında varsayılan ekip seçimi
  useEffect(() => {
    if (isAddModalOpen && teams.length > 0 && !newDev.teamId) {
      setNewDev(prev => ({ ...prev, teamId: teams[0].id }));
    }
  }, [isAddModalOpen, teams]);

  const handleAddDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newDev.name && newDev.role && newDev.teamId) {
      await addMemberToTeam(newDev.teamId, newDev.name);
      setNewDev({ name: '', role: 'Developer', level: 'Junior', teamId: teams[0]?.id || '' });
      setIsAddModalOpen(false);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName) {
      await addTeam(newTeamName);
      setNewTeamName('');
      setIsAddTeamModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-500 mb-1">
              <Users size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Ekip Kapasitesi</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Geliştirici Kaynak Yönetimi</h1>
            <p className="text-muted-foreground font-medium">Bireysel performans ve iş yükü dağılım analizi</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshData}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl font-bold border border-border hover:bg-accent transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span>Yenile</span>
            </button>
            <button 
              onClick={() => setIsAddTeamModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-secondary text-foreground rounded-xl font-bold border border-border hover:bg-accent transition-all"
            >
              <Shield size={18} />
              <span>Yeni Ekip Oluştur</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              <UserPlus size={18} />
              <span>Geliştirici Ekle</span>
            </button>
          </div>
        </header>

        {/* Add Team Modal */}
        {isAddTeamModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
                <h3 className="text-xl font-bold text-foreground">Yeni Ekip Oluştur</h3>
                <button onClick={() => setIsAddTeamModalOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddTeam} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Ekip Adı</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Örn: Mobile Team"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddTeamModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground font-bold hover:bg-secondary transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Ekip Oluştur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Developer Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
                <h3 className="text-xl font-bold text-foreground">Yeni Geliştirici Ekle</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddDeveloper} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Ad Soyad</label>
                  <input 
                    type="text" 
                    required
                    value={newDev.name}
                    onChange={(e) => setNewDev({ ...newDev, name: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                    placeholder="Geliştirici adı..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Rol / Pozisyon</label>
                  <input 
                    type="text" 
                    required
                    value={newDev.role}
                    onChange={(e) => setNewDev({ ...newDev, role: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                    placeholder="Frontend, Backend vb..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Kıdem Seviyesi</label>
                  <select 
                    value={newDev.level}
                    onChange={(e) => setNewDev({ ...newDev, level: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Ekip Ataması</label>
                  <select 
                    value={newDev.teamId}
                    onChange={(e) => setNewDev({ ...newDev, teamId: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                  >
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Geliştiriciyi Kaydet
                </button>
              </form>
            </div>
          </div>
        )}

        <section className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-secondary/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <BarChart size={20} className="text-indigo-500" />
              </div>
              <h2 className="text-xl font-black text-foreground tracking-tight">İş Yükü & Verimlilik Tablosu</h2>
            </div>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-card border-b border-border">
                <tr className="bg-secondary/50">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Geliştirici</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ekip</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Seviye</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">İş Yükü</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Verimlilik</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {developers.map((dev, i) => {
                  const team = teams.find(t => t.id === dev.teamId);
                  return (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg ${dev.bg} flex items-center justify-center border border-border/50`}>
                            <span className={`text-xs font-black ${dev.color}`}>{dev.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{dev.name}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{dev.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-muted-foreground">{team?.name || 'Belirsiz'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          dev.level === 'Senior' || dev.level === 'Lead' ? 'bg-purple-500/10 text-purple-500' :
                          dev.level === 'Mid' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          {dev.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${dev.workload > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                              style={{ width: `${dev.workload}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-foreground">%{dev.workload}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-black ${dev.efficiency > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          %{dev.efficiency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-wider ${
                          dev.status === 'Müsait' ? 'text-emerald-500' : 
                          dev.status === 'Meşgul' ? 'text-blue-500' : 
                          'text-red-500'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full bg-current ${dev.status === 'Müsait' ? 'animate-pulse' : ''}`} />
                          <span>{dev.status}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Teams Sections */}
        {teams.map((team) => {
          const teamDevs = developers.filter(d => d.teamId === team.id);
          return (
            <section key={team.id} className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Shield size={20} className="text-primary" />
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">{team.name}</h2>
                <span className="px-3 py-1 bg-secondary text-muted-foreground text-[10px] font-black rounded-full uppercase tracking-wider">
                  {teamDevs.length} Üye
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamDevs.length > 0 ? (
                  teamDevs.map((dev, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-2xl ${dev.bg} flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform`}>
                          <span className={`text-lg font-black ${dev.color}`}>{dev.name[0]}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          dev.status === 'Müsait' ? 'bg-emerald-500/10 text-emerald-500' : 
                          dev.status === 'Meşgul' ? 'bg-blue-500/10 text-blue-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {dev.status}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{dev.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground mb-4">{dev.role}</p>
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-muted-foreground">Verimlilik</span>
                            <span className="text-foreground">%{dev.efficiency}</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${
                                dev.efficiency > 90 ? 'bg-emerald-500' : dev.efficiency > 80 ? 'bg-blue-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${dev.efficiency}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-secondary rounded-full">
                      <Users size={32} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Henüz Üye Yok</h4>
                      <p className="text-sm text-muted-foreground">Bu ekibe henüz bir geliştirici atanmamış.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DeveloperHeatmap data={developers.map(d => ({ name: d.name, workload: d.workload, efficiency: d.efficiency }))} />
          </div>
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-full">
              <h3 className="font-bold text-foreground mb-6 flex items-center space-x-2">
                <Star className="text-amber-500" size={18} />
                <span>Haftalık Öne Çıkanlar</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <CheckCircle2 className="text-emerald-500" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">En Çok Görev Tamamlayan</p>
                    <p className="text-xs text-muted-foreground">Zeynep (12 görev)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Clock className="text-blue-500" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Ortalama Yanıt Süresi</p>
                    <p className="text-xs text-muted-foreground">1.4 Saat (-%15 iyileşme)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-red-500/10 rounded-xl">
                    <AlertCircle className="text-red-500" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Kritik İş Yükü Uyarısı</p>
                    <p className="text-xs text-muted-foreground">Mehmet için kapasite aşımı.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
