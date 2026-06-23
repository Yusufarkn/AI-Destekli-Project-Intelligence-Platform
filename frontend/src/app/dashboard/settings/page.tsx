'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Bell, Database, Cpu, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { useProject } from '@/components/ProjectProvider';

export default function SettingsPage() {
  const { selectedProject, updateProject, syncLocalDataToFirebase } = useProject();
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    delaySensitivity: 50,
    bugThreshold: 30,
    emailNotifications: true,
    slackIntegration: false
  });

  useEffect(() => {
    if (selectedProject?.settings) {
      setLocalSettings(selectedProject.settings);
    }
  }, [selectedProject]);

  const handleSave = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      await updateProject(selectedProject.id, { settings: localSettings });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await syncLocalDataToFirebase();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (error) {
      console.error('Senkronizasyon hatası:', error);
    } finally {
      setSyncLoading(false);
    }
  };

  const sections = [
    {
      title: 'Yapay Zeka Risk Parametreleri',
      description: 'AI modelinin risk skorlarını nasıl hesaplayacağını özelleştirin.',
      icon: Cpu,
      settings: [
        { 
          id: 'delaySensitivity',
          name: 'Gecikme Hassasiyeti', 
          description: 'Gecikme ihtimaline karşı modelin duyarlılığı.', 
          type: 'range',
          value: localSettings.delaySensitivity,
          onChange: (val: number) => setLocalSettings(prev => ({ ...prev, delaySensitivity: val }))
        },
        { 
          id: 'bugThreshold',
          name: 'Bug Yoğunluğu Eşiği', 
          description: 'Kritik bug yoğunluğu seviyesi.', 
          type: 'range',
          value: localSettings.bugThreshold,
          onChange: (val: number) => setLocalSettings(prev => ({ ...prev, bugThreshold: val }))
        },
      ]
    },
    {
      title: 'Bildirim Ayarları',
      description: 'Kritik risk durumlarında nasıl bilgilendirilmek istersiniz?',
      icon: Bell,
      settings: [
        { 
          id: 'emailNotifications',
          name: 'E-posta Bildirimleri', 
          description: 'Haftalık özet ve kritik uyarılar.', 
          type: 'toggle', 
          active: localSettings.emailNotifications,
          onToggle: () => setLocalSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))
        },
        { 
          id: 'slackIntegration',
          name: 'Slack Entegrasyonu', 
          description: 'Kanal bazlı anlık bildirimler.', 
          type: 'toggle', 
          active: localSettings.slackIntegration,
          onToggle: () => setLocalSettings(prev => ({ ...prev, slackIntegration: !prev.slackIntegration }))
        },
      ]
    },
    {
      title: 'Veri Kaynakları',
      description: 'Analiz için kullanılan veri kaynaklarını yönetin.',
      icon: Database,
      settings: [
        { name: 'GitHub Entegrasyonu', description: 'Repo bazlı commit analizi.', type: 'status', status: 'Bağlı' },
        { name: 'Jira Entegrasyonu', description: 'Sprint ve task takibi.', type: 'status', status: 'Beklemede' },
      ]
    },
    {
      title: 'Veritabanı Senkronizasyonu',
      description: 'Local storage üzerindeki verilerinizi kalıcı olarak Firebase\'e aktarın.',
      icon: Database,
      settings: [
        { 
          id: 'syncToFirebase',
          name: 'Firebase Bulut Aktarımı', 
          description: 'Tüm local verileri Firestore veritabanına taşır.', 
          type: 'button',
          label: syncSuccess ? 'Senkronizasyon Başarılı' : 'Hemen Senkronize Et',
          loading: syncLoading,
          success: syncSuccess,
          onClick: handleSync
        },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-2 text-primary mb-1">
              <Settings size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Yapılandırma</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Risk Ayarları</h1>
            <p className="text-muted-foreground font-medium">
              {selectedProject ? `"${selectedProject.name}" Projesi Ayarları` : 'Sistem parametrelerini yönetin'}
            </p>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading || !selectedProject}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
              saveSuccess 
                ? 'bg-emerald-500 text-white' 
                : 'bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            <span>{saveSuccess ? 'Kaydedildi' : 'Ayarları Kaydet'}</span>
          </button>
        </header>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-secondary/20 flex items-center space-x-4">
                <div className="p-2 bg-background rounded-lg border border-border">
                  <section.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {section.settings.map((setting: any, j) => (
                  <div key={j} className="flex items-center justify-between group">
                    <div className="max-w-[70%]">
                      <p className="font-bold text-foreground text-sm">{setting.name}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <div>
                      {setting.type === 'range' && (
                        <div className="flex items-center space-x-4">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={setting.value}
                            onChange={(e) => setting.onChange(parseInt(e.target.value))}
                            className="accent-primary w-32 cursor-pointer" 
                          />
                          <span className="text-xs font-bold text-primary w-8">{setting.value}</span>
                        </div>
                      )}
                      {setting.type === 'toggle' && (
                        <div 
                          onClick={setting.onToggle}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.active ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${setting.active ? 'translate-x-5' : ''}`} />
                        </div>
                      )}
                      {setting.type === 'status' && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${setting.status === 'Bağlı' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                          {setting.status}
                        </span>
                      )}
                      {setting.type === 'button' && (
                        <button
                          onClick={setting.onClick}
                          disabled={setting.loading || setting.success}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                            setting.success 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-primary text-primary-foreground hover:opacity-90'
                          } disabled:opacity-50`}
                        >
                          {setting.loading && <Loader2 size={14} className="animate-spin" />}
                          {setting.success && <CheckCircle2 size={14} />}
                          <span>{setting.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
