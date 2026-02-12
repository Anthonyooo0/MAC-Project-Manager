import React, { useState, useCallback } from 'react';
import { dataStore } from '../lib/dataStore';
import { isAdmin } from '../lib/permissions';
import { toast } from './Toast';
import type {
  Project, Milestone, Task, ProjectUpdate,
  ProjectStatus, ProjectPriority, TaskStatus, MilestonePhase, ViewMode
} from '../types';

// =====================================================
// ICONS
// =====================================================
const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Back: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Alert: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Folder: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

// =====================================================
// HELPERS
// =====================================================
const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  planning: { label: 'Planning', color: 'text-purple-700', bg: 'bg-purple-100' },
  development: { label: 'In Development', color: 'text-blue-700', bg: 'bg-blue-100' },
  testing: { label: 'Testing', color: 'text-amber-700', bg: 'bg-amber-100' },
  deployed: { label: 'Deployed', color: 'text-green-700', bg: 'bg-green-100' },
  maintenance: { label: 'Maintenance', color: 'text-slate-700', bg: 'bg-slate-100' },
  on_hold: { label: 'On Hold', color: 'text-red-700', bg: 'bg-red-100' },
};

const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: 'text-red-700', bg: 'bg-red-100' },
  medium: { label: 'Medium', color: 'text-amber-700', bg: 'bg-amber-100' },
  low: { label: 'Low', color: 'text-slate-600', bg: 'bg-slate-100' },
};

const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'text-slate-500' },
  in_progress: { label: 'In Progress', color: 'text-blue-600' },
  done: { label: 'Done', color: 'text-green-600' },
  blocked: { label: 'Blocked', color: 'text-red-600' },
};

const formatDate = (d: string | null) => {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const daysUntil = (d: string | null): string => {
  if (!d) return '';
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  return `${diff}d left`;
};

// =====================================================
// MAIN APP
// =====================================================
interface AppProps {
  currentUser: string;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ currentUser, onLogout }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | ''>('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const userIsAdmin = isAdmin(currentUser);
  const projects = dataStore.getProjects();
  const stats = dataStore.getStats();

  const filteredProjects = projects.filter(p => {
    const matchSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tech_stack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    setViewMode('project');
  };

  const goBack = () => {
    setSelectedProjectId(null);
    setViewMode('dashboard');
  };

  const handleCreateProject = (data: Partial<Project>) => {
    dataStore.createProject({
      name: data.name || '',
      description: data.description || '',
      status: data.status || 'planning',
      priority: data.priority || 'medium',
      progress: data.progress || 0,
      tech_stack: data.tech_stack || [],
      departments: data.departments || [],
      start_date: data.start_date || null,
      target_date: data.target_date || null,
      notes: data.notes || '',
      created_by: currentUser,
    });
    toast.success('Project created');
    setShowProjectForm(false);
    refresh();
  };

  const handleUpdateProject = (data: Partial<Project>) => {
    if (!editingProject) return;
    dataStore.updateProject(editingProject.id, data);
    toast.success('Project updated');
    setEditingProject(null);
    setShowProjectForm(false);
    refresh();
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteProject = (id: string) => {
    dataStore.deleteProject(id);
    toast.success('Project deleted');
    setDeleteConfirmId(null);
    if (selectedProjectId === id) goBack();
    refresh();
  };

  const selectedProject = selectedProjectId ? dataStore.getProject(selectedProjectId) : null;

  return (
    <div className="min-h-screen bg-mac-light">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {viewMode === 'project' ? (
                <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icons.Back /></button>
              ) : (
                <img src="/mac_logo.png" alt="MAC" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div>
                <h1 className="text-lg font-bold text-slate-800">
                  {viewMode === 'project' && selectedProject ? selectedProject.name : 'Project Tracker'}
                </h1>
                <p className="text-xs text-slate-500">
                  {viewMode === 'project' ? 'Project Details' : 'MAC Products Software Development'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {viewMode !== 'project' && (
                <div className="flex bg-slate-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('dashboard')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'dashboard' ? 'bg-white text-mac-navy shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
                    Dashboard
                  </button>
                  <button onClick={() => setViewMode('report')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'report' ? 'bg-white text-mac-navy shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
                    Report
                  </button>
                  <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white text-mac-navy shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
                    Calendar
                  </button>
                </div>
              )}
              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded hidden sm:block">
                {projects.length} projects
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="hidden sm:inline">{currentUser.split('@')[0]}</span>
                <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Sign out"><Icons.Logout /></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'calendar' ? (
          <CalendarView />
        ) : viewMode === 'report' ? (
          <ReportView projects={projects} stats={stats} />
        ) : viewMode === 'project' && selectedProject ? (
          <ProjectDetailView
            project={selectedProject}
            currentUser={currentUser}
            isAdmin={userIsAdmin}
            onUpdate={(data) => { dataStore.updateProject(selectedProject.id, data); toast.success('Updated'); refresh(); }}
            onDelete={() => setDeleteConfirmId(selectedProject.id)}
            refresh={refresh}
          />
        ) : (
          <>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard label="Active Projects" value={stats.activeProjects} color="bg-blue-50 text-blue-700" />
              <StatCard label="Total Projects" value={stats.totalProjects} color="bg-slate-50 text-slate-700" />
              <StatCard label="Tasks Done" value={`${stats.completedTasks}/${stats.totalTasks}`} color="bg-green-50 text-green-700" />
              <StatCard label="Blockers" value={stats.blockers} color={stats.blockers > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-700'} />
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Search /></div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-mac-accent focus:ring-2 focus:ring-mac-accent/10 outline-none transition-all"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as ProjectStatus | '')}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                {userIsAdmin && (
                  <button
                    onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-mac-accent text-white rounded-xl font-medium hover:bg-mac-blue transition-colors"
                  >
                    <Icons.Plus /> New Project
                  </button>
                )}
              </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => openProject(project.id)}
                  onEdit={userIsAdmin ? () => { setEditingProject(project); setShowProjectForm(true); } : undefined}
                  onDelete={userIsAdmin ? () => setDeleteConfirmId(project.id) : undefined}
                  taskCount={dataStore.getTasks(project.id).length}
                  blockerCount={dataStore.getTasks(project.id).filter(t => t.is_blocker && t.status === 'blocked').length}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="flex justify-center mb-4"><Icons.Folder /></div>
                <h3 className="text-lg font-bold text-slate-700 mb-2">No projects found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or create a new project.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeSlide">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Delete Project</h2>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete this project and all its data? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => handleDeleteProject(deleteConfirmId)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectFormModal
          project={editingProject}
          onSave={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
        />
      )}
    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================
const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className={`rounded-2xl p-4 ${color} border border-slate-200/50`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs font-medium opacity-75 mt-1">{label}</div>
  </div>
);

// =====================================================
// PROJECT CARD
// =====================================================
const ProjectCard: React.FC<{
  project: Project;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  taskCount: number;
  blockerCount: number;
}> = ({ project, onClick, onEdit, onDelete, taskCount, blockerCount }) => {
  const status = STATUS_CONFIG[project.status];
  const priority = PRIORITY_CONFIG[project.priority];

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-mac-accent/30 transition-all cursor-pointer group animate-fadeSlide"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 group-hover:text-mac-accent transition-colors">{project.name}</h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-slate-400 hover:text-mac-accent hover:bg-slate-100 rounded"
            >
              <Icons.Edit />
            </button>
          )}
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Icons.Trash />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-500">Progress</span>
          <span className="text-xs font-bold text-slate-700">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full animate-progress ${
              project.progress >= 100 ? 'bg-green-500' :
              project.progress >= 60 ? 'bg-mac-accent' :
              project.progress >= 30 ? 'bg-amber-400' :
              'bg-slate-300'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>{priority.label}</span>
        {blockerCount > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
            <Icons.Alert /> {blockerCount} blocker{blockerCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span>{taskCount} tasks</span>
          {project.target_date && (
            <span className="flex items-center gap-1">
              <Icons.Clock />
              {daysUntil(project.target_date)}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {project.tech_stack.slice(0, 3).map(t => (
            <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono">{t}</span>
          ))}
          {project.tech_stack.length > 3 && <span className="text-[10px]">+{project.tech_stack.length - 3}</span>}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// PROJECT DETAIL VIEW
// =====================================================
const ProjectDetailView: React.FC<{
  project: Project;
  currentUser: string;
  isAdmin: boolean;
  onUpdate: (data: Partial<Project>) => void;
  onDelete: () => void;
  refresh: () => void;
}> = ({ project, currentUser, isAdmin, onUpdate, onDelete, refresh }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const milestones = dataStore.getMilestones(project.id);
  const tasks = dataStore.getTasks(project.id);
  const updates = dataStore.getUpdates(project.id);
  const status = STATUS_CONFIG[project.status];
  const priority = PRIORITY_CONFIG[project.priority];

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    dataStore.createTask({
      project_id: project.id,
      milestone_id: null,
      title: newTaskTitle.trim(),
      description: '',
      status: 'todo',
      is_blocker: false,
      due_date: null,
      completed_at: null,
      display_order: tasks.length,
    });
    setNewTaskTitle('');
    toast.success('Task added');
    refresh();
  };

  const toggleTask = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    dataStore.updateTask(task.id, {
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date().toISOString() : null,
    });
    refresh();
  };

  const cycleTaskStatus = (task: Task) => {
    const order: TaskStatus[] = ['todo', 'in_progress', 'done'];
    const current = order.indexOf(task.status);
    const next = order[(current + 1) % order.length];
    dataStore.updateTask(task.id, {
      status: next,
      completed_at: next === 'done' ? new Date().toISOString() : null,
    });
    refresh();
  };

  const toggleBlocker = (task: Task) => {
    dataStore.updateTask(task.id, {
      is_blocker: !task.is_blocker,
      status: !task.is_blocker ? 'blocked' : 'todo',
    });
    refresh();
  };

  const deleteTask = (id: string) => {
    dataStore.deleteTask(id);
    refresh();
  };

  const addUpdate = () => {
    if (!newUpdateContent.trim()) return;
    dataStore.createUpdate({
      project_id: project.id,
      content: newUpdateContent.trim(),
      update_type: 'note',
      created_by: currentUser,
    });
    setNewUpdateContent('');
    toast.success('Update posted');
    refresh();
  };

  const addMilestone = (data: { title: string; phase: MilestonePhase; due_date: string }) => {
    dataStore.createMilestone({
      project_id: project.id,
      title: data.title,
      phase: data.phase,
      status: 'todo',
      due_date: data.due_date || null,
      completed_at: null,
      display_order: milestones.length,
    });
    setShowMilestoneForm(false);
    toast.success('Milestone added');
    refresh();
  };

  const toggleMilestone = (m: Milestone) => {
    const newStatus: TaskStatus = m.status === 'done' ? 'todo' : 'done';
    dataStore.updateMilestone(m.id, {
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date().toISOString() : null,
    });
    refresh();
  };

  const recalcProgress = () => {
    if (tasks.length === 0) return;
    const done = tasks.filter(t => t.status === 'done').length;
    const newProgress = Math.round((done / tasks.length) * 100);
    onUpdate({ progress: newProgress });
  };

  return (
    <div className="space-y-6 animate-fadeSlide">
      {/* Project Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-mac-navy to-mac-blue text-white px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{project.name}</h2>
              <p className="text-blue-200 mt-1">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20">{status.label}</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20">{priority.label} Priority</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Overall Progress</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-mac-navy">{project.progress}%</span>
                {isAdmin && (
                  <button onClick={recalcProgress} className="text-xs text-mac-accent hover:underline">Auto-calc from tasks</button>
                )}
              </div>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-mac-accent rounded-full animate-progress" style={{ width: `${project.progress}%` }} />
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Date</span>{formatDate(project.start_date)}</div>
            <div><span className="text-xs font-bold text-slate-500 uppercase block mb-1">Target Date</span>{formatDate(project.target_date)}</div>
            <div><span className="text-xs font-bold text-slate-500 uppercase block mb-1">Departments</span>{project.departments.join(', ') || '\u2014'}</div>
            <div><span className="text-xs font-bold text-slate-500 uppercase block mb-1">Tech Stack</span>
              <div className="flex flex-wrap gap-1">{project.tech_stack.map(t => <span key={t} className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono">{t}</span>)}</div>
            </div>
          </div>

          {/* Status Changer */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Status:</span>
              {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate({ status: s })}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    project.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} ring-2 ring-offset-1 ring-current` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Milestones + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Milestones */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Milestones</h3>
              {isAdmin && (
                <button onClick={() => setShowMilestoneForm(!showMilestoneForm)} className="text-sm text-mac-accent hover:text-mac-blue font-medium">
                  + Add Milestone
                </button>
              )}
            </div>

            {showMilestoneForm && (
              <MilestoneForm onSave={addMilestone} onCancel={() => setShowMilestoneForm(false)} />
            )}

            {milestones.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No milestones yet</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {milestones.map(m => {
                  const ts = TASK_STATUS_CONFIG[m.status];
                  return (
                    <div key={m.id} className="px-6 py-3 flex items-center gap-4 hover:bg-slate-50">
                      {isAdmin && (
                        <button onClick={() => toggleMilestone(m)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          m.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-mac-accent'
                        }`}>
                          {m.status === 'done' && <Icons.Check />}
                        </button>
                      )}
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${m.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>{m.title}</span>
                        <span className="text-xs text-slate-400 ml-2 capitalize">{m.phase}</span>
                      </div>
                      <span className={`text-xs font-medium ${ts.color}`}>{ts.label}</span>
                      {m.due_date && <span className="text-xs text-slate-400">{formatDate(m.due_date)}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Tasks</h3>
            </div>

            {isAdmin && (
              <div className="px-6 py-3 border-b border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder="Add a task..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-mac-accent outline-none"
                />
                <button onClick={addTask} className="px-4 py-2 bg-mac-accent text-white rounded-lg text-sm font-medium hover:bg-mac-blue transition-colors">Add</button>
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No tasks yet</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tasks.map(task => {
                  const ts = TASK_STATUS_CONFIG[task.status];
                  return (
                    <div key={task.id} className="px-6 py-3 flex items-center gap-3 hover:bg-slate-50 group">
                      {isAdmin && (
                        <button onClick={() => toggleTask(task)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : task.status === 'blocked' ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-mac-accent'
                        }`}>
                          {task.status === 'done' && <Icons.Check />}
                          {task.status === 'blocked' && <span className="text-red-500 text-xs">!</span>}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <button onClick={() => isAdmin && cycleTaskStatus(task)} className={`text-sm text-left ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </button>
                        {task.is_blocker && <span className="ml-2 text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">BLOCKER</span>}
                      </div>
                      <span className={`text-xs font-medium ${ts.color} flex-shrink-0`}>{ts.label}</span>
                      {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => toggleBlocker(task)} className="p-1 text-slate-400 hover:text-red-500 rounded" title="Toggle blocker">
                            <Icons.Alert />
                          </button>
                          <button onClick={() => deleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500 rounded" title="Delete">
                            <Icons.Trash />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Updates + Notes */}
        <div className="space-y-6">
          {project.notes && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Notes</h3>
              <p className="text-sm text-slate-700">{project.notes}</p>
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">Activity Log</h3>
            </div>

            {isAdmin && (
              <div className="px-5 py-3 border-b border-slate-100">
                <textarea
                  value={newUpdateContent}
                  onChange={e => setNewUpdateContent(e.target.value)}
                  placeholder="Post an update..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-mac-accent outline-none resize-none"
                  rows={2}
                />
                <button onClick={addUpdate} className="mt-2 px-4 py-1.5 bg-mac-accent text-white rounded-lg text-sm font-medium hover:bg-mac-blue transition-colors">Post</button>
              </div>
            )}

            {updates.length === 0 ? (
              <div className="p-5 text-center text-slate-500 text-sm">No updates yet</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {updates.map(u => (
                  <div key={u.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        u.update_type === 'blocker' ? 'bg-red-500' :
                        u.update_type === 'milestone_complete' ? 'bg-green-500' :
                        u.update_type === 'status_change' ? 'bg-blue-500' :
                        'bg-slate-400'
                      }`} />
                      <span className="text-xs text-slate-400">{formatDate(u.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-700">{u.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {isAdmin && (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
              <h3 className="text-xs font-bold text-red-600 uppercase mb-3">Danger Zone</h3>
              <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                <Icons.Trash /> Delete Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MILESTONE FORM (inline)
// =====================================================
const MilestoneForm: React.FC<{
  onSave: (data: { title: string; phase: MilestonePhase; due_date: string }) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<MilestonePhase>('development');
  const [dueDate, setDueDate] = useState('');

  return (
    <div className="px-6 py-3 border-b border-slate-100 bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Milestone title" className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-mac-accent outline-none" />
        <select value={phase} onChange={e => setPhase(e.target.value as MilestonePhase)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-mac-accent outline-none">
          <option value="requirements">Requirements</option>
          <option value="design">Design</option>
          <option value="development">Development</option>
          <option value="testing">Testing</option>
          <option value="deployment">Deployment</option>
          <option value="documentation">Documentation</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-mac-accent outline-none" />
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => title && onSave({ title, phase, due_date: dueDate })} className="px-4 py-1.5 bg-mac-accent text-white rounded-lg text-sm font-medium">Add</button>
        <button onClick={onCancel} className="px-4 py-1.5 text-slate-500 hover:bg-slate-200 rounded-lg text-sm">Cancel</button>
      </div>
    </div>
  );
};

// =====================================================
// PROJECT FORM MODAL
// =====================================================
const ProjectFormModal: React.FC<{
  project: Project | null;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'planning');
  const [priority, setPriority] = useState<ProjectPriority>(project?.priority || 'medium');
  const [techStack, setTechStack] = useState(project?.tech_stack.join(', ') || '');
  const [departments, setDepartments] = useState(project?.departments.join(', ') || '');
  const [startDate, setStartDate] = useState(project?.start_date || '');
  const [targetDate, setTargetDate] = useState(project?.target_date || '');
  const [notes, setNotes] = useState(project?.notes || '');

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Project name is required'); return; }
    onSave({
      name: name.trim(),
      description: description.trim(),
      status,
      priority,
      tech_stack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      departments: departments.split(',').map(s => s.trim()).filter(Boolean),
      start_date: startDate || null,
      target_date: targetDate || null,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Icons.Close /></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Project Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. HTS Code Dashboard" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief project description..." rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none">
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as ProjectPriority)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none">
                {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Target Date</label>
              <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tech Stack <span className="font-normal text-slate-400">(comma-separated)</span></label>
            <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} placeholder="React, TypeScript, Supabase..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Departments <span className="font-normal text-slate-400">(comma-separated)</span></label>
            <input type="text" value={departments} onChange={e => setDepartments(e.target.value)} placeholder="IT, Operations, Sales..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-mac-accent outline-none resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-mac-accent text-white rounded-xl text-sm font-medium hover:bg-mac-blue transition-colors">
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// REPORT VIEW
// =====================================================
const ReportView: React.FC<{
  projects: Project[];
  stats: ReturnType<typeof dataStore.getStats>;
}> = ({ projects, stats }) => {
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityCounts = projects.reduce((acc, p) => {
    acc[p.priority] = (acc[p.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="space-y-6 animate-fadeSlide">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Portfolio Report</h2>
        <p className="text-sm text-slate-500 mb-6">Overview of all MAC Products software projects</p>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.totalProjects}</div>
            <div className="text-xs font-medium text-blue-600 mt-1">Total Projects</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.activeProjects}</div>
            <div className="text-xs font-medium text-green-600 mt-1">Active</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{avgProgress}%</div>
            <div className="text-xs font-medium text-purple-600 mt-1">Avg Progress</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">{stats.completedTasks}/{stats.totalTasks}</div>
            <div className="text-xs font-medium text-amber-600 mt-1">Tasks Done</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-700">{stats.blockers}</div>
            <div className="text-xs font-medium text-red-600 mt-1">Blockers</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3">By Status</h3>
            <div className="space-y-2">
              {(Object.keys(STATUS_CONFIG) as ProjectStatus[]).map(s => {
                const count = statusCounts[s] || 0;
                const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} w-28 text-center`}>{STATUS_CONFIG[s].label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${STATUS_CONFIG[s].bg.replace('100', '400')}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-3">By Priority</h3>
            <div className="space-y-2">
              {(Object.keys(PRIORITY_CONFIG) as ProjectPriority[]).map(p => {
                const count = priorityCounts[p] || 0;
                const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;
                return (
                  <div key={p} className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[p].bg} ${PRIORITY_CONFIG[p].color} w-28 text-center`}>{PRIORITY_CONFIG[p].label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${PRIORITY_CONFIG[p].bg.replace('100', '400')}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Table */}
        <h3 className="text-sm font-bold text-slate-700 mb-3">All Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-2 font-bold text-slate-500 text-xs uppercase">Project</th>
                <th className="pb-2 font-bold text-slate-500 text-xs uppercase">Status</th>
                <th className="pb-2 font-bold text-slate-500 text-xs uppercase">Priority</th>
                <th className="pb-2 font-bold text-slate-500 text-xs uppercase">Progress</th>
                <th className="pb-2 font-bold text-slate-500 text-xs uppercase">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3">
                    <div className="font-medium text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.tech_stack.slice(0, 3).join(', ')}</div>
                  </td>
                  <td className="py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[p.status].bg} ${STATUS_CONFIG[p.status].color}`}>{STATUS_CONFIG[p.status].label}</span></td>
                  <td className="py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[p.priority].bg} ${PRIORITY_CONFIG[p.priority].color}`}>{PRIORITY_CONFIG[p.priority].label}</span></td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.progress >= 100 ? 'bg-green-500' : p.progress >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-mono text-slate-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-slate-500">{formatDate(p.target_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// CALENDAR VIEW
// =====================================================
type BlockType = 'school' | 'development' | 'code_study' | 'planning' | 'maintenance';

interface TimeBlock {
  day: number; // 0=Sun, 1=Mon, ..., 6=Sat
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  label: string;
  type: BlockType;
}

const BLOCK_STYLES: Record<BlockType, { bg: string; hover: string; legendColor: string; legendLabel: string; category: 'school' | 'work' }> = {
  school:      { bg: 'bg-blue-400',   hover: 'hover:bg-blue-500',   legendColor: 'bg-blue-400',   legendLabel: 'School',        category: 'school' },
  development: { bg: 'bg-green-500',  hover: 'hover:bg-green-600',  legendColor: 'bg-green-500',  legendLabel: 'Development',   category: 'work' },
  code_study:  { bg: 'bg-purple-400', hover: 'hover:bg-purple-500', legendColor: 'bg-purple-400', legendLabel: 'Code Study',    category: 'work' },
  planning:    { bg: 'bg-amber-400',  hover: 'hover:bg-amber-500',  legendColor: 'bg-amber-400',  legendLabel: 'Planning',      category: 'work' },
  maintenance: { bg: 'bg-teal-400',   hover: 'hover:bg-teal-500',   legendColor: 'bg-teal-400',   legendLabel: 'Maintenance',   category: 'work' },
};

const SCHEDULE: TimeBlock[] = [
  // ── School ──
  // Monday
  { day: 1, startHour: 8, startMin: 0, endHour: 9, endMin: 30, label: 'Calculus III', type: 'school' },
  { day: 1, startHour: 10, startMin: 0, endHour: 11, endMin: 0, label: 'General Chemistry II', type: 'school' },
  // Tuesday
  { day: 2, startHour: 8, startMin: 0, endHour: 9, endMin: 30, label: 'Calculus III', type: 'school' },
  { day: 2, startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Microcontrollers & IoT', type: 'school' },
  // Wednesday
  { day: 3, startHour: 8, startMin: 0, endHour: 9, endMin: 30, label: 'General Chemistry II', type: 'school' },
  // Thursday
  { day: 4, startHour: 8, startMin: 0, endHour: 9, endMin: 30, label: 'Calculus III', type: 'school' },
  { day: 4, startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Microcontrollers & IoT', type: 'school' },
  // Friday
  { day: 5, startHour: 10, startMin: 0, endHour: 11, endMin: 30, label: 'Calculus III', type: 'school' },

  // ── Work — Monday (7h) ──
  { day: 1, startHour: 11, startMin: 0, endHour: 16, endMin: 0, label: 'Development', type: 'development' },     // 5h
  { day: 1, startHour: 16, startMin: 0, endHour: 18, endMin: 0, label: 'Code Study', type: 'code_study' },        // 2h

  // ── Work — Tuesday (6h) ──
  { day: 2, startHour: 9, startMin: 30, endHour: 12, endMin: 0, label: 'Development', type: 'development' },      // 2.5h
  { day: 2, startHour: 13, startMin: 30, endHour: 15, endMin: 30, label: 'Planning', type: 'planning' },           // 2h
  { day: 2, startHour: 15, startMin: 30, endHour: 17, endMin: 0, label: 'Development', type: 'development' },      // 1.5h

  // ── Work — Wednesday (8h) ──
  { day: 3, startHour: 9, startMin: 30, endHour: 12, endMin: 30, label: 'Development', type: 'development' },      // 3h
  { day: 3, startHour: 12, startMin: 30, endHour: 14, endMin: 30, label: 'Maintenance', type: 'maintenance' },     // 2h
  { day: 3, startHour: 14, startMin: 30, endHour: 17, endMin: 30, label: 'Development', type: 'development' },     // 3h

  // ── Work — Thursday (6h) ──
  { day: 4, startHour: 9, startMin: 30, endHour: 12, endMin: 0, label: 'Development', type: 'development' },       // 2.5h
  { day: 4, startHour: 13, startMin: 30, endHour: 15, endMin: 30, label: 'Code Study', type: 'code_study' },       // 2h
  { day: 4, startHour: 15, startMin: 30, endHour: 17, endMin: 0, label: 'Development', type: 'development' },      // 1.5h

  // ── Work — Friday (6h) ──
  { day: 5, startHour: 11, startMin: 30, endHour: 14, endMin: 30, label: 'Development', type: 'development' },     // 3h
  { day: 5, startHour: 14, startMin: 30, endHour: 15, endMin: 30, label: 'Planning', type: 'planning' },           // 1h
  { day: 5, startHour: 15, startMin: 30, endHour: 16, endMin: 30, label: 'Maintenance', type: 'maintenance' },     // 1h
  { day: 5, startHour: 16, startMin: 30, endHour: 17, endMin: 30, label: 'Development', type: 'development' },     // 1h

  // ── Work — Saturday (7h) ──
  { day: 6, startHour: 8, startMin: 0, endHour: 15, endMin: 0, label: 'Development', type: 'development' },        // 7h
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const START_HOUR = 6;
const END_HOUR = 20;

const CalendarView: React.FC = () => {
  const blockDuration = (b: TimeBlock) => (b.endHour + b.endMin / 60) - (b.startHour + b.startMin / 60);

  const totalByType = (type: BlockType) => SCHEDULE.filter(b => b.type === type).reduce((s, b) => s + blockDuration(b), 0);
  const totalByCategory = (cat: 'school' | 'work') => SCHEDULE.filter(b => BLOCK_STYLES[b.type].category === cat).reduce((s, b) => s + blockDuration(b), 0);

  const schoolHours = totalByCategory('school');
  const workHours = totalByCategory('work');

  const formatHour = (h: number) => {
    const period = h >= 12 ? 'pm' : 'am';
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}${period}`;
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const workTypes: BlockType[] = ['development', 'code_study', 'planning', 'maintenance'];

  return (
    <div className="space-y-6 animate-fadeSlide">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 border border-slate-200/50">
          <div className="text-2xl font-bold text-blue-700">{schoolHours.toFixed(1)}h</div>
          <div className="text-xs font-medium text-blue-600 opacity-75 mt-1">School / Week</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-slate-200/50">
          <div className="text-2xl font-bold text-green-700">{workHours.toFixed(1)}h</div>
          <div className="text-xs font-medium text-green-600 opacity-75 mt-1">Work / Week</div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50">
          <div className="text-2xl font-bold text-slate-700">{(schoolHours + workHours).toFixed(1)}h</div>
          <div className="text-xs font-medium text-slate-600 opacity-75 mt-1">Total / Week</div>
        </div>
      </div>

      {/* Work Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Work Breakdown — {workHours}h / week</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {workTypes.map(type => {
            const hrs = totalByType(type);
            const style = BLOCK_STYLES[type];
            return (
              <div key={type} className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded ${style.legendColor} flex-shrink-0`}></span>
                <div>
                  <div className="text-sm font-bold text-slate-700">{hrs}h</div>
                  <div className="text-[10px] text-slate-500">{style.legendLabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-bold text-slate-800">Weekly Schedule</h2>
          <div className="flex items-center gap-3 text-xs font-medium flex-wrap">
            {(Object.keys(BLOCK_STYLES) as BlockType[]).map(type => (
              <span key={type} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded ${BLOCK_STYLES[type].legendColor} inline-block`}></span>
                {BLOCK_STYLES[type].legendLabel}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-200">
              <div className="p-2"></div>
              {DAYS.map((day, i) => {
                const dayWork = SCHEDULE.filter(b => b.day === i && BLOCK_STYLES[b.type].category === 'work').reduce((s, b) => s + blockDuration(b), 0);
                const daySchool = SCHEDULE.filter(b => b.day === i && BLOCK_STYLES[b.type].category === 'school').reduce((s, b) => s + blockDuration(b), 0);
                return (
                  <div key={day} className="p-2 text-center border-l border-slate-200">
                    <div className="text-xs font-bold text-slate-700">{day}</div>
                    {(dayWork > 0 || daySchool > 0) && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {daySchool > 0 && <span className="text-blue-500">{daySchool}h</span>}
                        {daySchool > 0 && dayWork > 0 && <span> + </span>}
                        {dayWork > 0 && <span className="text-green-500">{dayWork}h</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
              {/* Hour rows */}
              {hours.map(hour => (
                <React.Fragment key={hour}>
                  <div className="h-12 border-b border-slate-100 flex items-start justify-end pr-2 pt-0.5">
                    <span className="text-[10px] font-medium text-slate-400">{formatHour(hour)}</span>
                  </div>
                  {DAYS.map((_, dayIdx) => (
                    <div key={dayIdx} className="h-12 border-b border-l border-slate-100 relative"></div>
                  ))}
                </React.Fragment>
              ))}

              {/* Event Blocks (positioned absolutely) */}
              {SCHEDULE.map((block, idx) => {
                const top = ((block.startHour + block.startMin / 60) - START_HOUR) * 48;
                const height = blockDuration(block) * 48;
                const left = `calc(60px + ${block.day} * ((100% - 60px) / 7) + 2px)`;
                const width = `calc((100% - 60px) / 7 - 4px)`;
                const style = BLOCK_STYLES[block.type];

                return (
                  <div
                    key={idx}
                    className={`absolute ${style.bg} ${style.hover} text-white rounded-lg px-2 py-1 overflow-hidden transition-colors cursor-default`}
                    style={{ top: `${top}px`, height: `${height}px`, left, width }}
                  >
                    <div className="text-[11px] font-bold leading-tight truncate">{block.label}</div>
                    {height >= 36 && (
                      <div className="text-[9px] opacity-80">{`${block.startHour > 12 ? block.startHour - 12 : block.startHour}:${block.startMin.toString().padStart(2, '0')}-${block.endHour > 12 ? block.endHour - 12 : block.endHour}:${block.endMin.toString().padStart(2, '0')}`}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
