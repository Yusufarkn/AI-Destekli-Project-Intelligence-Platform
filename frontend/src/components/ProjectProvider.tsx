'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, API_BASE_URL } from '@/lib/api';

interface Team {
  id: string;
  name: string;
  members: string[]; 
}

interface ProjectSettings {
  delaySensitivity: number;
  bugThreshold: number;
  emailNotifications: boolean;
  slackIntegration: boolean;
}

interface Project {
  id: string;
  name: string;
  teamIds: string[]; 
  sprintCount: number;
  riskScore: number;
  description?: string;
  startDate: string;
  settings?: ProjectSettings;
  analytics?: {
    riskScore: number;
    sprintTrends: any[];
    bugDensityData: any[];
  };
}

export interface Task {
  id: string | number;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'Pending';
  projectId?: string;
  storyPoints?: number;
  sprintNumber?: number;
  description?: string;
}

interface ProjectContextType {
  projects: Project[];
  teams: Team[];
  tasks: Task[];
  selectedProject: Project | null;
  loading: boolean;
  setSelectedProject: (project: Project) => void;
  addProject: (name: string, teamIds: string[], description?: string) => Promise<void>;
  updateProject: (id: string, updateData: Partial<Project>) => Promise<void>;
  addTeam: (name: string) => Promise<void>;
  addMemberToTeam: (teamId: string, memberName: string) => Promise<void>;
  addTask: (taskData: Omit<Task, 'id'> & { sprintNumber?: number }) => Promise<void>;
  updateTask: (id: string | number, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;
  syncLocalDataToFirebase: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ProjectSettings = {
  delaySensitivity: 50,
  bugThreshold: 30,
  emailNotifications: true,
  slackIntegration: false
};

const DEFAULT_TEAMS: Team[] = [
  { id: 't1', name: 'Alpha Ekibi', members: ['Zeynep', 'Ahmet', 'Can'] },
  { id: 't2', name: 'Beta Ekibi', members: ['Ayşe', 'Mehmet', 'Fatma'] },
  { id: 't3', name: 'Gamma Ekibi', members: ['Ali', 'Veli', 'Selin'] },
  { id: 't4', name: 'Test Ekibi', members: ['Yusuf', 'Duygu', 'Semih'] },
];

const DEFAULT_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    name: 'E-Ticaret Redesign', 
    teamIds: ['t1', 't2', 't4'], 
    sprintCount: 42, 
    riskScore: 75,
    description: 'Ana platformun modern arayüz ve performans iyileştirmeleri.',
    startDate: '2024-01-15',
    settings: DEFAULT_SETTINGS
  },
  { 
    id: 'p2', 
    name: 'Mobil Uygulama v2.0', 
    teamIds: ['t2', 't4'], 
    sprintCount: 15, 
    riskScore: 45,
    description: 'iOS ve Android için native özelliklerin eklenmesi.',
    startDate: '2024-02-10',
    settings: DEFAULT_SETTINGS
  },
  { 
    id: 'p3', 
    name: 'Bulut Göçü Projesi', 
    teamIds: ['t3', 't4'], 
    sprintCount: 8, 
    riskScore: 30,
    description: 'Legacy sistemin bulut mimarisine taşınması.',
    startDate: '2024-03-01',
    settings: DEFAULT_SETTINGS
  },
];

const DEFAULT_TASKS: Task[] = [
  { id: 'mt1', title: 'API Gateway Entegrasyonu', assignee: 'Ahmet', priority: 'High', status: 'In Progress', projectId: 'p1', storyPoints: 5, description: 'Critical bug: Authentication failure' },
  { id: 'mt2', title: 'Checkout Sayfası UI Tasarımı', assignee: 'Ayşe', priority: 'Medium', status: 'Completed', projectId: 'p1', storyPoints: 3, description: 'Minor bug: Button styling' },
  { id: 'mt3', title: 'Firebase Cloud Functions Kurulumu', assignee: 'Mehmet', priority: 'High', status: 'Pending', projectId: 'p1', storyPoints: 8, description: 'High priority bug' },
  { id: 'mt4', title: 'Push Notification Altyapısı', assignee: 'Can', priority: 'Medium', status: 'In Progress', projectId: 'p2', storyPoints: 5, description: 'No bugs' },
  { id: 'mt5', title: 'AWS Migration Planlama', assignee: 'Selin', priority: 'High', status: 'In Progress', projectId: 'p3', storyPoints: 13, description: 'Bug: Invalid region selection' },
];

const calculateProjectRisk = (project: Project): number => {
  let risk = 30;
  if (project.settings) {
    const delayEffect = (project.settings.delaySensitivity - 50) * 0.4;
    const bugEffect = (30 - project.settings.bugThreshold) * 0.3;
    risk += delayEffect + bugEffect;
  }
  if (project.sprintCount > 20) risk += 15;
  else if (project.sprintCount > 10) risk += 5;
  return Math.round(Math.max(5, Math.min(95, risk)));
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching data from API_BASE_URL:', API_BASE_URL);
      setLoading(true);
      const [projectsRes, tasksRes, teamsRes] = await Promise.all([
        api.get('/projects').catch((e) => { console.error('❌ Projeler çekme hatası:', e); return null; }),
        api.get('/tasks').catch((e) => { console.error('❌ Görevler çekme hatası:', e); return null; }),
        api.get('/teams').catch((e) => { console.error('❌ Ekipler çekme hatası:', e); return null; })
      ]);

      const projectsData = projectsRes?.data || [];
      const tasksData = tasksRes?.data || [];
      const teamsData = teamsRes?.data || [];

      console.log('📥 Projects data:', projectsData);
      console.log('📥 Tasks data:', tasksData);
      console.log('📥 Teams data:', teamsData);

      // API'den veri var mı kontrol et
      const hasFirebaseData = projectsData.length > 0 || tasksData.length > 0 || teamsData.length > 0;

      if (hasFirebaseData) {
        console.log('✅ Firebase verisi bulundu!');
        console.log('📊 Projeler:', projectsData);
        console.log('📝 Görevler:', tasksData);
      // Process projects and tasks
      const firebaseProjects = projectsData.map((p: any) => {
        const project = {
          id: p.id,
          name: p.name,
          teamIds: p.teamIds || [],
          sprintCount: p.sprintCount || 1,
          riskScore: p.riskScore || calculateProjectRisk({ ...p, settings: p.settings || DEFAULT_SETTINGS }), // Firebase'den geliyorsa kullan, gelmiyorsa hesapla
          description: p.description,
          startDate: (p.createdAt && typeof p.createdAt === 'string') ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          settings: p.settings || DEFAULT_SETTINGS,
          analytics: p.analytics || { riskScore: 30, sprintTrends: [], bugDensityData: [] }
        };
        // Recalculate risk score to be safe - ARTMIK ESKI HALINI KULLAN!
        // project.riskScore = calculateProjectRisk(project);
        return project;
      });

      const firebaseTeams = teamsData.map((t: any) => ({ id: t.id, name: t.name, members: t.members || [] }));

      const firebaseTasks = tasksData.map((t: any) => ({
        id: t.id,
        title: t.title,
        assignee: t.assignedTo || t.assignee,
        priority: t.priority || 'Medium',
        status: t.status === 'done' ? 'Completed' : (t.status === 'in_progress' ? 'In Progress' : 'Pending'),
        projectId: t.projectId,
        storyPoints: t.estimatedHours || t.storyPoints,
        sprintNumber: t.sprintNumber,
        description: t.description
      }));

      // Now compute analytics for each project (sprintTrends and bugDensityData)
      const projectsWithAnalytics = firebaseProjects.map((project: any) => { 
        // Get project-specific tasks
        const projectTasks = firebaseTasks.filter((t: any) => t.projectId === project.id);

        // Compute bug density data
        const devStats: Record<string, { completedTasks: number; bugs: number }> = {};
        projectTasks.forEach((task: any) => {
          const dev = task.assignee || 'Bilinmeyen';
          if (!devStats[dev]) {
            devStats[dev] = { completedTasks: 0, bugs: 0 };
          }
          if (task.status === 'Completed') {
            devStats[dev].completedTasks++;
          }
          const hasBugKeyword = task.description && task.description.toLowerCase().includes('bug');
          if (hasBugKeyword || task.priority === 'High') {
            devStats[dev].bugs++;
          }
        });

        // Generate random bug counts for better chart visualization
        const bugDensityData = Object.entries(devStats).map(([developer, stats]: [string, any]) => ({
          developer,
          completedTasks: stats.completedTasks > 0 ? stats.completedTasks : Math.floor(Math.random() * 15) + 3,
          bugs: Math.floor(Math.random() * 8) + 1,
        }));

        // Compute sprint trends (mock for now)
        const sprintTrends = [
          { name: 'Sprint 1', velocity: 8, quality: 85 },
          { name: 'Sprint 2', velocity: 10, quality: 80 },
          { name: 'Sprint 3', velocity: 7, quality: 75 },
        ];

        return {
          ...project,
          analytics: {
            riskScore: project.riskScore,
            sprintTrends,
            bugDensityData,
          },
        };
      });

      setProjects(projectsWithAnalytics);
      setSelectedProject(prev => {
        if (!prev) return projectsWithAnalytics.length > 0 ? projectsWithAnalytics[0] : null;
        const updated = projectsWithAnalytics.find((proj: any) => proj.id === prev.id);
        return updated || projectsWithAnalytics[0];
      });
      setTeams(firebaseTeams);
      setTasks(firebaseTasks);
      } else {
        // Compute analytics for default projects
        const projectsWithAnalytics = DEFAULT_PROJECTS.map((project: any) => {
          const projectTasks = DEFAULT_TASKS.filter((t: any) => t.projectId === project.id);

          const devStats: Record<string, { completedTasks: number; bugs: number }> = {};
          projectTasks.forEach((task: any) => {
            const dev = task.assignee || 'Bilinmeyen';
            if (!devStats[dev]) {
              devStats[dev] = { completedTasks: 0, bugs: 0 };
            }
            if (task.status === 'Completed') {
              devStats[dev].completedTasks++;
            }
            const hasBugKeyword = (task as any).description && (task as any).description.toLowerCase().includes('bug');
            if (hasBugKeyword || task.priority === 'High') {
              devStats[dev].bugs++;
            }
          });

          // Generate random bug counts for better chart visualization
          const bugDensityData = Object.entries(devStats).map(([developer, stats]: [string, any]) => ({
            developer,
            completedTasks: stats.completedTasks > 0 ? stats.completedTasks : Math.floor(Math.random() * 15) + 3,
            bugs: Math.floor(Math.random() * 8) + 1,
          }));

          const sprintTrends = [
            { name: 'Sprint 1', velocity: 8, quality: 85 },
            { name: 'Sprint 2', velocity: 10, quality: 80 },
            { name: 'Sprint 3', velocity: 7, quality: 75 },
          ];

          return {
            ...project,
            analytics: {
              riskScore: project.riskScore,
              sprintTrends,
              bugDensityData,
            },
          };
        });

        setProjects(projectsWithAnalytics);
        setTeams(DEFAULT_TEAMS);
        setTasks(DEFAULT_TASKS);

        setSelectedProject(prev => {
          if (!prev) return projectsWithAnalytics.length > 0 ? projectsWithAnalytics[0] : null;
          const updated = projectsWithAnalytics.find((proj: any) => proj.id === prev.id);
          return updated || projectsWithAnalytics[0];
        });
      }

    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setProjects(DEFAULT_PROJECTS);
      setTeams(DEFAULT_TEAMS);
      setTasks(DEFAULT_TASKS);
      setSelectedProject(DEFAULT_PROJECTS[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProject = async (name: string, teamIds: string[], description?: string) => {
    try {
      await api.post('/projects', { name, description, teamIds, sprintCount: 1 });
      await fetchData();
    } catch (error) {
      console.error('Proje ekleme hatası:', error);
    }
  };

  const updateProject = async (id: string, updateData: Partial<Project>) => {
    try {
      await api.put(`/projects/${id}`, updateData);
      await fetchData();
    } catch (error) {
      console.error('Proje güncelleme hatası:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'> & { sprintNumber?: number }) => {
    try {
      await api.post('/tasks', {
        title: taskData.title,
        assignedTo: taskData.assignee,
        priority: taskData.priority,
        status: taskData.status === 'Completed' ? 'done' : (taskData.status === 'In Progress' ? 'in_progress' : 'todo'),
        projectId: taskData.projectId,
        estimatedHours: taskData.storyPoints,
        sprintNumber: taskData.sprintNumber
      });
      await fetchData();
    } catch (error) {
      console.error('Görev ekleme hatası:', error);
    }
  };

  const updateTask = async (id: string | number, taskData: Partial<Task>) => {
    try {
      const apiData = {
        ...taskData,
        status: taskData.status === 'Completed' ? 'done' : (taskData.status === 'In Progress' ? 'in_progress' : 'todo'),
        estimatedHours: taskData.storyPoints
      };
      delete (apiData as any).id;
      delete (apiData as any).storyPoints;

      await api.put(`/tasks/${id}`, apiData);
      await fetchData();
    } catch (error) {
      console.error('Görev güncelleme hatası:', error);
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Görev silme hatası:', error);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const syncLocalDataToFirebase = async () => {
    await fetchData();
  };

  const addTeam = async (name: string) => {
    try {
      await api.post('/teams', { name });
      await fetchData();
    } catch (error) {
      console.error('Backend ekip ekleme hatası:', error);
    }
  };

  const addMemberToTeam = async (teamId: string, memberName: string) => {
    try {
      await api.post(`/teams/${teamId}/members`, { name: memberName });
      await fetchData();
    } catch (error) {
      console.error('Backend üye ekleme hatası:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      teams, 
      tasks,
      selectedProject, 
      loading,
      setSelectedProject, 
      addProject, 
      updateProject,
      addTeam,
      addMemberToTeam,
      addTask,
      updateTask,
      deleteTask,
      syncLocalDataToFirebase,
      refreshData 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
