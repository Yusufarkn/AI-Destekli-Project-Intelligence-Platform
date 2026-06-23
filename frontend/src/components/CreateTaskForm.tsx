'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useProject } from '@/components/ProjectProvider';

interface CreateTaskFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onClose, onSubmit }) => {
  const { teams, selectedProject } = useProject();
  const [formData, setFormData] = useState({
    title: '',
    assignee: '',
    storyPoints: '',
    priority: 'Medium',
    sprintNumber: selectedProject?.sprintCount || 1
  });

  // Seçili projeye dahil olan ekipleri filtrele
  const projectTeams = selectedProject 
    ? teams.filter(t => selectedProject.teamIds.includes(t.id)) 
    : [];

  // Sadece bu ekiplerdeki üyeleri listele
  const allMembers = Array.from(new Set(projectTeams.flatMap(team => team.members)));

  // Mevcut sprintten başlayarak sonraki 5 sprinti seçenek olarak sun
  const sprintOptions = Array.from({ length: 6 }, (_, i) => (selectedProject?.sprintCount || 1) + i);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Görev adı zorunludur.';
    if (!formData.assignee) newErrors.assignee = 'Atanan kişi seçilmelidir.';
    if (!formData.storyPoints) newErrors.storyPoints = 'Tahmini süre gereklidir.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData); // async fonksiyonu bekle
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        {/* Form Header */}
        <div className="px-8 py-6 bg-card border-b border-border flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="text-primary" size={18} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Yeni Görev Oluştur</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Görev Adı */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Görev Adı</label>
            <input
              type="text"
              className={`w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 ${errors.title ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
              placeholder="Örn: API Entegrasyonu"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && (
              <div className="flex items-center space-x-1 mt-2 text-red-500">
                <AlertCircle size={14} />
                <p className="text-xs font-medium">{errors.title}</p>
              </div>
            )}
          </div>

          {/* Atanan Kişi */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Atanan Kişi</label>
              <select
                className={`w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none ${errors.assignee ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              >
                <option value="">Seçiniz...</option>
                {allMembers.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
              {errors.assignee && (
                <div className="flex items-center space-x-1 mt-2 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-xs font-medium">{errors.assignee}</p>
                </div>
              )}
            </div>

            {/* Sprint Seçimi */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Hedef Sprint</label>
              <select
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                value={formData.sprintNumber}
                onChange={(e) => setFormData({ ...formData, sprintNumber: parseInt(e.target.value) })}
              >
                {sprintOptions.map(num => (
                  <option key={num} value={num}>Sprint {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Story Points */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Story Points</label>
              <input
                type="number"
                className={`w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-muted-foreground/50 ${errors.storyPoints ? 'border-red-500 ring-4 ring-red-500/10' : ''}`}
                placeholder="Örn: 5"
                value={formData.storyPoints}
                onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value })}
              />
              {errors.storyPoints && (
                <div className="flex items-center space-x-1 mt-2 text-red-500">
                  <AlertCircle size={14} />
                  <p className="text-xs font-medium">{errors.storyPoints}</p>
                </div>
              )}
            </div>

            {/* Öncelik */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Öncelik</label>
              <select
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all appearance-none"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low">Düşük</option>
                <option value="Medium">Orta</option>
                <option value="High">Yüksek</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-border rounded-xl text-foreground font-bold hover:bg-secondary transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
              Görevi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
