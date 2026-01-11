// Navigation Items
export const MAIN_NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { name: 'Projects', href: '/projects', icon: 'FolderOpen' },
  { name: 'Jobs', href: '/jobs', icon: 'Play' },
  { name: 'Test Cases', href: '/test-cases', icon: 'FlaskConical' },
  { name: 'Policies & Compliance', href: '/policies', icon: 'Shield' },
  { name: 'Reports', href: '/reports', icon: 'FileText' },
] as const;

export const BILLING_NAV_ITEMS = [
  { name: 'Credits & Billing', href: '/billing', icon: 'Wallet' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { name: 'Test Case Management', href: '/admin/test-cases', icon: 'FlaskConical' },
  { name: 'Policy Management', href: '/admin/policies', icon: 'FileStack' },
  { name: 'User Management', href: '/admin/tenants', icon: 'Users' },
  { name: 'Usage Analytics', href: '/admin/analytics', icon: 'BarChart3' },
] as const;

// Status Options
export const JOB_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
] as const;

// Modality Options
export const MODALITY_OPTIONS = [
  { value: 'all', label: 'All Modalities' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
] as const;

// Source Options
export const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'default-admin', label: 'Default Admin' },
  { value: 'tenant-admin', label: 'Tenant Admin' },
] as const;

// AI System Types
export const AI_SYSTEM_TYPES = [
  { value: 'llm', label: 'LLM' },
  { value: 'multimodal', label: 'Multimodal' },
] as const;

// User Roles
export const USER_ROLES = [
  { value: 'tenant-admin', label: 'Tenant Admin' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'viewer', label: 'Viewer' },
] as const;

// Time Period Options
export const TIME_PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
] as const;

// Complexity Units
export const COMPLEXITY_UNITS = [
  { value: 1, label: '1 unit' },
  { value: 2, label: '2 units' },
  { value: 3, label: '3 units' },
  { value: 4, label: '4 units' },
  { value: 5, label: '5 units' },
] as const;

// Test Case Status
export const TEST_CASE_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
] as const;

// Debounce delay for search inputs
export const SEARCH_DEBOUNCE_MS = 500;
