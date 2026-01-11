// Job Types
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Job {
  id: string;
  name: string;
  project: string;
  projectId: string;
  status: JobStatus;
  risk: RiskLevel | null;
  tests: {
    passed: number;
    total: number;
  };
  credits: number;
  created: string;
  progress: number;
}

// Project Types
export type ProjectStatus = 'active' | 'draft';
export type AISystemType = 'llm' | 'multimodal';

export interface Project {
  id: string;
  name: string;
  description: string;
  aiSystemType: AISystemType;
  status: ProjectStatus;
  jobsCount: number;
  lastValidation: string | null;
}

// Test Case Types
export type Modality = 'text' | 'image' | 'video';
export type TestCaseStatus = 'active' | 'draft' | 'published';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  source: string;
  modality: Modality;
  complexity: number;
  tags: string[];
  document: string;
  status: TestCaseStatus;
  version: string;
  documentReferences?: string[];
}

// Policy Types
export type PolicyStatus = 'indexed' | 'processing' | 'failed';

export interface Policy {
  id: string;
  name: string;
  description: string;
  version: string;
  status: PolicyStatus;
  articles: number;
  uploaded: string;
  uploader?: string;
  size?: number;
}

// Report Types
export type ReportType = 'compliance' | 'audit' | 'summary';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  project: string;
  generated: string;
  size: string;
}

// Billing Types
export interface Transaction {
  id: string;
  description: string;
  credits: number;
  date: string;
  hasInvoice: boolean;
}

// User Types
export type UserRole = 'tenant-admin' | 'project-manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  joined: string;
}

// Dashboard Types
export interface DashboardStats {
  totalJobsRun: number;
  jobsCompleted: number;
  successRate: number;
  activeAlerts: number;
  creditsRemaining: number;
  estimatedJobsRemaining: number;
  percentChange: number;
}

export interface RiskSummary {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

// Analytics Types
export interface AnalyticsStats {
  totalJobs: number;
  activeUsers: number;
  creditsConsumed: number;
  revenue: number;
  jobsChange: number;
  usersChange: number;
  revenueChange: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created: string;
}

// Settings Types
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface NotificationSettings {
  jobCompleted: boolean;
  jobFailed: boolean;
  creditsLow: boolean;
  policyUpdates: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}
