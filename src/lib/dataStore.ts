/**
 * Local data store for demo/development.
 * This mirrors the Supabase schema so switching to real DB is trivial.
 * Pre-loaded with Anthony's actual MAC Products projects.
 */

import type { Project, Milestone, Task, ProjectUpdate } from '../types';

// Generate simple IDs
let idCounter = 100;
const newId = () => String(++idCounter);

// =====================================================
// SEED DATA - Anthony's real projects
// =====================================================

export const seedProjects: Project[] = [
  {
    id: '1',
    name: 'HTS Code Dashboard',
    description: 'Harmonized Tariff Schedule lookup tool for the accounting team. Search by part number, HTS code, description, or vendor with tariff breakdowns.',
    status: 'deployed',
    priority: 'high',
    progress: 95,
    tech_stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Azure AD'],
    departments: ['Accounting', 'Purchasing'],
    start_date: '2025-01-15',
    target_date: '2025-02-01',
    notes: 'Migrated from static JSON to Supabase. Added CRUD, audit log, custom columns. Need to finalize RLS policies.',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
  {
    id: '2',
    name: 'PP Command Center',
    description: 'Central hub for the Purchasing & Planning department. Milestone tracking, team tools, and workflow management.',
    status: 'development',
    priority: 'high',
    progress: 65,
    tech_stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Azure AD'],
    departments: ['Purchasing', 'Planning'],
    start_date: '2025-01-01',
    target_date: '2025-03-15',
    notes: 'Core milestone tracking done. Working on team dashboards and reporting features.',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
  {
    id: '3',
    name: 'Quality Dashboard',
    description: 'Real-time quality metrics dashboard for the Quality team. NCR tracking, supplier scorecards, and trend analysis.',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    tech_stack: ['React', 'TypeScript', 'Supabase'],
    departments: ['Quality'],
    start_date: '2025-02-15',
    target_date: '2025-04-30',
    notes: 'Requirements gathering phase. Meeting with Quality team next week.',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
  {
    id: '4',
    name: 'Router Generator',
    description: 'Automated router/traveler document generator for manufacturing. Pulls BOM data and generates standardized work instructions.',
    status: 'development',
    priority: 'medium',
    progress: 40,
    tech_stack: ['React', 'TypeScript', 'Python', 'PDF Generation'],
    departments: ['Engineering', 'Manufacturing'],
    start_date: '2025-01-20',
    target_date: '2025-03-30',
    notes: 'PDF template engine working. Need to integrate with ERP data source.',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
  {
    id: '5',
    name: 'AI Training Program',
    description: 'Department-by-department AI adoption program. Teaching teams to use Claude, ChatGPT, and custom tools for their workflows.',
    status: 'maintenance',
    priority: 'low',
    progress: 50,
    tech_stack: ['Claude', 'ChatGPT', 'Documentation'],
    departments: ['All Departments'],
    start_date: '2024-11-01',
    target_date: null,
    notes: 'Ongoing. Accounting and Purchasing onboarded. Engineering and Quality next.',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
  {
    id: '6',
    name: 'Project Tracker',
    description: 'This app! Internal project management tool for tracking software development progress across MAC Products.',
    status: 'development',
    priority: 'medium',
    progress: 30,
    tech_stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Azure AD'],
    departments: ['IT'],
    start_date: '2025-02-09',
    target_date: '2025-02-28',
    notes: 'Building with Claude. Same stack as HTS Dashboard.',
    created_at: '2025-02-09T00:00:00Z',
    updated_at: '2025-02-09T00:00:00Z',
    created_by: 'anthony.jimenez@macproducts.net',
  },
];

export const seedMilestones: Milestone[] = [
  // HTS Dashboard milestones
  { id: 'm1', project_id: '1', title: 'Requirements & Data Model', phase: 'requirements', status: 'done', due_date: '2025-01-17', completed_at: '2025-01-17T00:00:00Z', display_order: 0, created_at: '2025-01-15T00:00:00Z' },
  { id: 'm2', project_id: '1', title: 'UI Design & Search', phase: 'design', status: 'done', due_date: '2025-01-20', completed_at: '2025-01-19T00:00:00Z', display_order: 1, created_at: '2025-01-15T00:00:00Z' },
  { id: 'm3', project_id: '1', title: 'Supabase Migration', phase: 'development', status: 'done', due_date: '2025-01-25', completed_at: '2025-01-24T00:00:00Z', display_order: 2, created_at: '2025-01-15T00:00:00Z' },
  { id: 'm4', project_id: '1', title: 'CRUD & Audit Log', phase: 'development', status: 'done', due_date: '2025-01-30', completed_at: '2025-01-29T00:00:00Z', display_order: 3, created_at: '2025-01-15T00:00:00Z' },
  { id: 'm5', project_id: '1', title: 'Azure Deployment', phase: 'deployment', status: 'done', due_date: '2025-02-01', completed_at: '2025-02-01T00:00:00Z', display_order: 4, created_at: '2025-01-15T00:00:00Z' },
  { id: 'm6', project_id: '1', title: 'User Documentation', phase: 'documentation', status: 'in_progress', due_date: '2025-02-15', completed_at: null, display_order: 5, created_at: '2025-01-15T00:00:00Z' },

  // PP Command Center milestones
  { id: 'm7', project_id: '2', title: 'Core Architecture', phase: 'design', status: 'done', due_date: '2025-01-10', completed_at: '2025-01-10T00:00:00Z', display_order: 0, created_at: '2025-01-01T00:00:00Z' },
  { id: 'm8', project_id: '2', title: 'Milestone Tracking Module', phase: 'development', status: 'done', due_date: '2025-01-25', completed_at: '2025-01-23T00:00:00Z', display_order: 1, created_at: '2025-01-01T00:00:00Z' },
  { id: 'm9', project_id: '2', title: 'Team Dashboards', phase: 'development', status: 'in_progress', due_date: '2025-02-15', completed_at: null, display_order: 2, created_at: '2025-01-01T00:00:00Z' },
  { id: 'm10', project_id: '2', title: 'Reporting & Analytics', phase: 'development', status: 'todo', due_date: '2025-03-01', completed_at: null, display_order: 3, created_at: '2025-01-01T00:00:00Z' },
  { id: 'm11', project_id: '2', title: 'UAT & Deployment', phase: 'testing', status: 'todo', due_date: '2025-03-15', completed_at: null, display_order: 4, created_at: '2025-01-01T00:00:00Z' },

  // Router Generator milestones
  { id: 'm12', project_id: '4', title: 'PDF Template Engine', phase: 'development', status: 'done', due_date: '2025-02-01', completed_at: '2025-02-01T00:00:00Z', display_order: 0, created_at: '2025-01-20T00:00:00Z' },
  { id: 'm13', project_id: '4', title: 'ERP Data Integration', phase: 'development', status: 'in_progress', due_date: '2025-02-28', completed_at: null, display_order: 1, created_at: '2025-01-20T00:00:00Z' },
  { id: 'm14', project_id: '4', title: 'Testing with Engineering', phase: 'testing', status: 'todo', due_date: '2025-03-15', completed_at: null, display_order: 2, created_at: '2025-01-20T00:00:00Z' },
];

export const seedTasks: Task[] = [
  // HTS Dashboard tasks
  { id: 't1', project_id: '1', milestone_id: 'm6', title: 'Write user guide for accounting team', description: '', status: 'in_progress', is_blocker: false, due_date: '2025-02-15', completed_at: null, display_order: 0, created_at: '2025-02-01T00:00:00Z' },
  { id: 't2', project_id: '1', milestone_id: 'm6', title: 'Record training video walkthrough', description: '', status: 'todo', is_blocker: false, due_date: '2025-02-15', completed_at: null, display_order: 1, created_at: '2025-02-01T00:00:00Z' },
  { id: 't3', project_id: '1', milestone_id: null, title: 'Tighten RLS policies for production', description: 'Currently using open policies, need to restrict to authenticated users', status: 'todo', is_blocker: false, due_date: '2025-02-20', completed_at: null, display_order: 2, created_at: '2025-02-05T00:00:00Z' },

  // PP Command Center tasks
  { id: 't4', project_id: '2', milestone_id: 'm9', title: 'Build buyer dashboard component', description: '', status: 'in_progress', is_blocker: false, due_date: '2025-02-12', completed_at: null, display_order: 0, created_at: '2025-02-01T00:00:00Z' },
  { id: 't5', project_id: '2', milestone_id: 'm9', title: 'Add planner view with calendar', description: '', status: 'todo', is_blocker: false, due_date: '2025-02-15', completed_at: null, display_order: 1, created_at: '2025-02-01T00:00:00Z' },
  { id: 't6', project_id: '2', milestone_id: 'm10', title: 'Weekly summary report generator', description: 'Auto-generate PDF report for Juan', status: 'todo', is_blocker: false, due_date: '2025-03-01', completed_at: null, display_order: 0, created_at: '2025-02-01T00:00:00Z' },
  { id: 't7', project_id: '2', milestone_id: null, title: 'Get ERP API access from IT', description: 'Waiting on credentials from corporate IT', status: 'blocked', is_blocker: true, due_date: null, completed_at: null, display_order: 3, created_at: '2025-01-28T00:00:00Z' },

  // Router Generator tasks
  { id: 't8', project_id: '4', milestone_id: 'm13', title: 'Map BOM fields to router template', description: '', status: 'in_progress', is_blocker: false, due_date: '2025-02-20', completed_at: null, display_order: 0, created_at: '2025-02-01T00:00:00Z' },
  { id: 't9', project_id: '4', milestone_id: 'm13', title: 'Build data validation layer', description: '', status: 'todo', is_blocker: false, due_date: '2025-02-25', completed_at: null, display_order: 1, created_at: '2025-02-01T00:00:00Z' },

  // Quality Dashboard tasks
  { id: 't10', project_id: '3', milestone_id: null, title: 'Interview Quality team for requirements', description: '', status: 'in_progress', is_blocker: false, due_date: '2025-02-20', completed_at: null, display_order: 0, created_at: '2025-02-09T00:00:00Z' },
  { id: 't11', project_id: '3', milestone_id: null, title: 'Get NCR data export from current system', description: '', status: 'todo', is_blocker: false, due_date: '2025-02-25', completed_at: null, display_order: 1, created_at: '2025-02-09T00:00:00Z' },
];

export const seedUpdates: ProjectUpdate[] = [
  { id: 'u1', project_id: '1', content: 'Migrated all 89 records from data.json to Supabase. CRUD operations working.', update_type: 'note', created_at: '2025-01-29T00:00:00Z', created_by: 'anthony.jimenez@macproducts.net' },
  { id: 'u2', project_id: '1', content: 'Deployed to Azure Static Web Apps. Accounting team has access.', update_type: 'status_change', created_at: '2025-02-01T00:00:00Z', created_by: 'anthony.jimenez@macproducts.net' },
  { id: 'u3', project_id: '2', content: 'Milestone tracking module shipped. Michelle testing.', update_type: 'milestone_complete', created_at: '2025-01-23T00:00:00Z', created_by: 'anthony.jimenez@macproducts.net' },
  { id: 'u4', project_id: '2', content: 'Blocked on ERP API access — corporate IT slow to respond.', update_type: 'blocker', created_at: '2025-01-28T00:00:00Z', created_by: 'anthony.jimenez@macproducts.net' },
  { id: 'u5', project_id: '4', content: 'PDF template engine prototype done. Generates clean router docs.', update_type: 'milestone_complete', created_at: '2025-02-01T00:00:00Z', created_by: 'anthony.jimenez@macproducts.net' },
];

// =====================================================
// IN-MEMORY STORE
// =====================================================

class DataStore {
  projects: Project[] = [...seedProjects];
  milestones: Milestone[] = [...seedMilestones];
  tasks: Task[] = [...seedTasks];
  updates: ProjectUpdate[] = [...seedUpdates];

  // Projects
  getProjects() { return this.projects; }
  getProject(id: string) { return this.projects.find(p => p.id === id) || null; }

  createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const project: Project = {
      ...data,
      id: newId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.projects.push(project);
    return project;
  }

  updateProject(id: string, data: Partial<Project>): Project | null {
    const idx = this.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...data, updated_at: new Date().toISOString() };
    return this.projects[idx];
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.milestones = this.milestones.filter(m => m.project_id !== id);
    this.tasks = this.tasks.filter(t => t.project_id !== id);
    this.updates = this.updates.filter(u => u.project_id !== id);
  }

  // Milestones
  getMilestones(projectId: string) {
    return this.milestones.filter(m => m.project_id === projectId).sort((a, b) => a.display_order - b.display_order);
  }

  createMilestone(data: Omit<Milestone, 'id' | 'created_at'>): Milestone {
    const milestone: Milestone = { ...data, id: newId(), created_at: new Date().toISOString() };
    this.milestones.push(milestone);
    return milestone;
  }

  updateMilestone(id: string, data: Partial<Milestone>): Milestone | null {
    const idx = this.milestones.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.milestones[idx] = { ...this.milestones[idx], ...data };
    return this.milestones[idx];
  }

  deleteMilestone(id: string) {
    this.milestones = this.milestones.filter(m => m.id !== id);
  }

  // Tasks
  getTasks(projectId: string) {
    return this.tasks.filter(t => t.project_id === projectId).sort((a, b) => a.display_order - b.display_order);
  }

  createTask(data: Omit<Task, 'id' | 'created_at'>): Task {
    const task: Task = { ...data, id: newId(), created_at: new Date().toISOString() };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, data: Partial<Task>): Task | null {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = { ...this.tasks[idx], ...data };
    return this.tasks[idx];
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  // Updates
  getUpdates(projectId: string) {
    return this.updates.filter(u => u.project_id === projectId).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  createUpdate(data: Omit<ProjectUpdate, 'id' | 'created_at'>): ProjectUpdate {
    const update: ProjectUpdate = { ...data, id: newId(), created_at: new Date().toISOString() };
    this.updates.push(update);
    return update;
  }

  // Stats
  getStats() {
    const active = this.projects.filter(p => p.status === 'development' || p.status === 'testing');
    const blockers = this.tasks.filter(t => t.is_blocker && t.status === 'blocked');
    const completedTasks = this.tasks.filter(t => t.status === 'done');
    const totalTasks = this.tasks.length;

    return {
      totalProjects: this.projects.length,
      activeProjects: active.length,
      blockers: blockers.length,
      completedTasks: completedTasks.length,
      totalTasks,
      taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
    };
  }
}

export const dataStore = new DataStore();
