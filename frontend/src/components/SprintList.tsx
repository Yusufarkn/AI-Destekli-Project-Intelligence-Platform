'use client';

import React from 'react';
import { 
  ChevronRight, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Settings,
  Trash2,
  Edit,
  ExternalLink,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useProject, Task } from './ProjectProvider';

interface SprintListProps {
  sprintName: string;
  status: string;
  tasks: Task[];
}

const SprintList: React.FC<SprintListProps> = ({ sprintName, status, tasks }) => {
  const [showSprintModal, setShowSprintModal] = React.useState(false);
  const [activeMenuId, setActiveMenuId] = React.useState<string | number | null>(null);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
  const { updateTask, deleteTask } = useProject();

  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    Medium: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    Low: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  };

  const statusIcons = {
    'In Progress': <Clock size={14} className="text-blue-500" />,
    'Completed': <CheckCircle2 size={14} className="text-emerald-500" />,
    'Pending': <AlertCircle size={14} className="text-gray-400" />,
  };

  const handleDeleteTask = async (id: string | number) => {
    await deleteTask(id);
    setActiveMenuId(null);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      await updateTask(editingTask.id, editingTask);
      setEditingTask(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative">
      <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
        <div>
          <h3 className="text-lg font-bold text-foreground">{sprintName}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{status}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowSprintModal(true)}
          className="flex items-center space-x-1 px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold text-foreground hover:bg-secondary transition-colors shadow-sm active:scale-95"
        >
          <span>Sprint Detayları</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-secondary/50">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Görev Adı</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Atanan</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Öncelik</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Durum</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Eylemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-secondary/20 transition-colors group relative">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center border border-border">
                      <User size={12} className="text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{task.assignee}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                    priorityColors[task.priority]
                  )}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {statusIcons[task.status as keyof typeof statusIcons]}
                    <span className="text-sm font-medium text-foreground">{task.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground active:scale-90"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  
                  {activeMenuId === task.id && (
                    <div className="absolute right-6 top-12 z-50 w-48 bg-card border border-border rounded-xl shadow-xl p-2 animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={() => { setEditingTask(task); setActiveMenuId(null); }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                        <span>Düzenle</span>
                      </button>
                      <button 
                        onClick={() => { setViewingTask(task); setActiveMenuId(null); }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary rounded-lg transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Detaylara Git</span>
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Sil</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-xl font-bold text-foreground">Görevi Düzenle</h3>
              <button onClick={() => setEditingTask(null)} className="p-2 hover:bg-secondary rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Görev Başlığı</label>
                <input 
                  type="text" 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Atanan Kişi</label>
                <input 
                  type="text" 
                  value={editingTask.assignee}
                  onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                  className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Öncelik</label>
                  <select 
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Durum</label>
                  <select 
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-black hover:opacity-90 transition-all">
                Değişiklikleri Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/20">
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Görev Detayları</h3>
                <p className="text-muted-foreground font-medium">#{viewingTask.id} numaralı görev</p>
              </div>
              <button onClick={() => setViewingTask(null)} className="p-2 hover:bg-secondary rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Başlık</h4>
                <p className="text-xl font-bold text-foreground">{viewingTask.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Atanan</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center border border-border">
                      <User size={18} />
                    </div>
                    <p className="font-bold text-foreground">{viewingTask.assignee}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Öncelik</h4>
                  <span className={cn(
                    "inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border",
                    priorityColors[viewingTask.priority]
                  )}>
                    {viewingTask.priority}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-2">Durum</h4>
                <div className="flex items-center space-x-2 p-4 bg-secondary/30 rounded-2xl border border-border">
                  {statusIcons[viewingTask.status as keyof typeof statusIcons]}
                  <span className="font-bold text-foreground">{viewingTask.status}</span>
                </div>
              </div>
            </div>
            <div className="p-8 bg-secondary/10 border-t border-border flex justify-end">
              <button onClick={() => setViewingTask(null)} className="px-8 py-3 bg-secondary text-foreground rounded-2xl font-black hover:bg-accent transition-all">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sprint Details Modal */}
      {showSprintModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/20">
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">{sprintName}</h2>
                <p className="text-muted-foreground font-medium">Sprint performansı ve istatistikleri</p>
              </div>
              <button 
                onClick={() => setShowSprintModal(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Toplam Puan</p>
                <h4 className="text-3xl font-black text-foreground">124 SP</h4>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Tamamlanan</p>
                <h4 className="text-3xl font-black text-emerald-500">88 SP</h4>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Kalan Süre</p>
                <h4 className="text-3xl font-black text-blue-500">4 Gün</h4>
              </div>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-border">
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Risk Seviyesi</p>
                <h4 className="text-3xl font-black text-amber-500">Düşük</h4>
              </div>
            </div>
            <div className="p-8 bg-secondary/10 border-t border-border flex justify-end">
              <button 
                onClick={() => setShowSprintModal(false)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-black hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintList;
