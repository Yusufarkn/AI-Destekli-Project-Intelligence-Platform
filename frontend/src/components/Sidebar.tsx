'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  Settings,
  Users,
  Sun,
  Moon,
  ChevronDown,
  Briefcase,
  Plus,
  X
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useProject } from './ProjectProvider';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { projects, teams, selectedProject, setSelectedProject, addProject } = useProject();
  const [isProjectMenuOpen, setIsProjectMenuOpen] = React.useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = React.useState(false);
  const [newProject, setNewProject] = React.useState({ 
    name: '', 
    teamIds: [] as string[],
    description: ''
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.teamIds.length > 0) {
      addProject(newProject.name, newProject.teamIds, newProject.description);
      setNewProject({ name: '', teamIds: [], description: '' });
      setIsAddProjectModalOpen(false);
    }
  };

  const toggleTeam = (teamId: string) => {
    setNewProject(prev => ({
      ...prev,
      teamIds: prev.teamIds.includes(teamId)
        ? prev.teamIds.filter(id => id !== teamId)
        : [...prev.teamIds, teamId]
    }));
  };

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analizler', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Geliştirici Yükü', href: '/dashboard/developers', icon: Users },
    { name: 'Risk Ayarları', href: '/dashboard/settings', icon: Settings },
  ];

  if (!mounted) {
    return <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 animate-pulse hidden md:flex" />;
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[55] md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-[60] flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <AlertTriangle className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-black text-foreground tracking-tight">RISK AI</span>
        </div>

        {/* Project Switcher */}
        <div className="mb-8 relative">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-4">Aktif Proje</p>
          <button 
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 border border-border rounded-xl hover:bg-secondary transition-all group"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <Briefcase size={16} className="text-primary shrink-0" />
              <span className="text-sm font-bold text-foreground truncate">{selectedProject?.name || 'Proje Seçilmedi'}</span>
            </div>
            <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", isProjectMenuOpen && "rotate-180")} />
          </button>

          {isProjectMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsProjectMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold transition-all hover:bg-secondary",
                    selectedProject?.id === project.id ? "text-primary bg-primary/5" : "text-foreground"
                  )}
                >
                  <Briefcase size={14} />
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsAddProjectModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-8 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all font-bold text-xs"
        >
          <Plus size={14} />
          <span>Yeni Proje Ekle</span>
        </button>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-border space-y-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center space-x-2">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'}</span>
          </div>
          <div className={cn(
            "w-8 h-4 rounded-full bg-muted relative transition-colors",
            theme === 'dark' ? "bg-primary" : ""
          )}>
            <div className={cn(
              "absolute top-1 left-1 w-2 h-2 rounded-full bg-white transition-transform",
              theme === 'dark' ? "translate-x-4" : ""
            )} />
          </div>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs border border-border">
            PM
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Proje Yöneticisi</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Yönetici Paneli</p>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-xl font-bold text-foreground">Yeni Proje Oluştur</h3>
              <button onClick={() => setIsAddProjectModalOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Proje Adı</label>
                <input 
                  type="text" 
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                  placeholder="Örn: E-Ticaret Redesign..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Sorumlu Ekipler</label>
                <div className="grid grid-cols-2 gap-2">
                  {teams.map(team => (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => toggleTeam(team.id)}
                      className={cn(
                        "px-3 py-2 text-xs font-bold rounded-xl border transition-all text-left",
                        newProject.teamIds.includes(team.id)
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50"
                      )}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Proje Açıklaması</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none min-h-[100px] resize-none"
                  placeholder="Proje hedefleri ve kapsamı..."
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Projeyi Oluştur
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};

export default Sidebar;
