/**
 * Supabase data layer for Project Tracker.
 * Tables are prefixed with pt_ to avoid conflicts with other apps sharing the same Supabase project.
 */

import { supabase } from './supabase';
import type { Project, Milestone, Task, ProjectUpdate } from '../types';

// =====================================================
// PROJECTS
// =====================================================

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('pt_projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('pt_projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data: project, error } = await supabase
    .from('pt_projects')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return project;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from('pt_projects')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('pt_projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// =====================================================
// MILESTONES
// =====================================================

export async function getMilestones(projectId: string): Promise<Milestone[]> {
  const { data, error } = await supabase
    .from('pt_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order');
  if (error) throw error;
  return data || [];
}

export async function createMilestone(data: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> {
  const { data: milestone, error } = await supabase
    .from('pt_milestones')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return milestone;
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone | null> {
  const { data: milestone, error } = await supabase
    .from('pt_milestones')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return milestone;
}

export async function deleteMilestone(id: string): Promise<void> {
  const { error } = await supabase
    .from('pt_milestones')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// =====================================================
// TASKS
// =====================================================

export async function getTasks(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('pt_tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('display_order');
  if (error) throw error;
  return data || [];
}

export async function getAllTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('pt_tasks')
    .select('*')
    .order('display_order');
  if (error) throw error;
  return data || [];
}

export async function createTask(data: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const { data: task, error } = await supabase
    .from('pt_tasks')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return task;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
  const { data: task, error } = await supabase
    .from('pt_tasks')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return task;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('pt_tasks')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// =====================================================
// UPDATES
// =====================================================

export async function getUpdates(projectId: string): Promise<ProjectUpdate[]> {
  const { data, error } = await supabase
    .from('pt_updates')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createUpdate(data: Omit<ProjectUpdate, 'id' | 'created_at'>): Promise<ProjectUpdate> {
  const { data: update, error } = await supabase
    .from('pt_updates')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return update;
}

// =====================================================
// STATS
// =====================================================

export async function getStats() {
  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from('pt_projects').select('status'),
    supabase.from('pt_tasks').select('status, is_blocker'),
  ]);

  const projects = projectsRes.data || [];
  const tasks = tasksRes.data || [];

  const active = projects.filter((p: { status: string }) => p.status === 'development' || p.status === 'testing');
  const blockers = tasks.filter((t: { is_blocker: boolean; status: string }) => t.is_blocker && t.status === 'blocked');
  const completedTasks = tasks.filter((t: { status: string }) => t.status === 'done');

  return {
    totalProjects: projects.length,
    activeProjects: active.length,
    blockers: blockers.length,
    completedTasks: completedTasks.length,
    totalTasks: tasks.length,
    taskCompletionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
  };
}
