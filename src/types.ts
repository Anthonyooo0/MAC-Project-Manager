// =====================================================
// PROJECT TRACKER TYPES
// =====================================================

export type ProjectStatus = 'planning' | 'development' | 'testing' | 'deployed' | 'maintenance' | 'on_hold';
export type ProjectPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type MilestonePhase = 'requirements' | 'design' | 'development' | 'testing' | 'deployment' | 'documentation';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number; // 0-100
  tech_stack: string[];
  departments: string[];
  start_date: string | null;
  target_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  phase: MilestonePhase;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  display_order: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  is_blocker: boolean;
  due_date: string | null;
  completed_at: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  content: string;
  update_type: 'note' | 'status_change' | 'milestone_complete' | 'blocker';
  created_at: string;
  created_by: string;
}

export interface WeeklySummary {
  week_start: string;
  projects_worked: number;
  tasks_completed: number;
  milestones_completed: number;
  blockers_active: number;
}

// Form data
export interface ProjectFormData {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  tech_stack: string[];
  departments: string[];
  start_date: string;
  target_date: string;
  notes: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  is_blocker: boolean;
  due_date: string;
  milestone_id: string | null;
}

export interface MilestoneFormData {
  title: string;
  phase: MilestonePhase;
  status: TaskStatus;
  due_date: string;
}

// View modes
export type ViewMode = 'dashboard' | 'project' | 'timeline' | 'report' | 'calendar';
