/**
 * Role-based permissions for the Project Tracker.
 *
 * Admin users can create, edit, and delete projects/tasks.
 * Viewers (like Juan) can see everything but not modify.
 */

const ADMIN_EMAILS: string[] = [
  'anthony.jimenez@macproducts.net',
];

// Juan and other stakeholders can view
const VIEWER_EMAILS: string[] = [
  'juan@macproducts.net',
  'michelle.soares@macproducts.net',
];

export type UserRole = 'admin' | 'viewer';

export function getUserRole(email: string | null): UserRole {
  if (!email) return 'viewer';
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'viewer';
}

export function isAdmin(email: string | null): boolean {
  return getUserRole(email) === 'admin';
}
