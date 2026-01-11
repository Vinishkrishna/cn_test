import type { AnalyticsStats, ChartDataPoint } from '~/types';

export const analyticsStats: AnalyticsStats = {
  totalJobs: 1284,
  activeUsers: 55,
  creditsConsumed: 27880,
  revenue: 1394,
  jobsChange: 12,
  usersChange: 8,
  revenueChange: 18,
};

export const jobsOverTime: ChartDataPoint[] = [
  { name: 'Jul', value: 120 },
  { name: 'Aug', value: 180 },
  { name: 'Sep', value: 210 },
  { name: 'Oct', value: 280 },
  { name: 'Nov', value: 320 },
  { name: 'Dec', value: 260 },
];

export const creditUsage: ChartDataPoint[] = [
  { name: 'Jul', value: 2800, value2: 3000 },
  { name: 'Aug', value: 3500, value2: 4000 },
  { name: 'Sep', value: 4200, value2: 5000 },
  { name: 'Oct', value: 5100, value2: 5500 },
  { name: 'Nov', value: 6200, value2: 6500 },
  { name: 'Dec', value: 5800, value2: 6200 },
];

export const tenantUsage: ChartDataPoint[] = [
  { name: 'Acme Corporation', value: 35 },
  { name: 'TechCorp Inc.', value: 25 },
  { name: 'HealthAI Labs', value: 22 },
  { name: 'Others', value: 18 },
];

export const testCaseUsage: ChartDataPoint[] = [
  { name: 'Bias Detection', value: 320 },
  { name: 'Hallucination', value: 245 },
  { name: 'Safety Filter', value: 198 },
  { name: 'Prompt Injection', value: 156 },
  { name: 'Fairness', value: 134 },
];

export const adminTestCaseStats = {
  totalTestCases: 24,
  published: 18,
  drafts: 6,
  totalUnits: 52,
};

export const adminUserStats = {
  totalMembers: 0,
  tenantAdmins: 0,
  projectManagers: 0,
  viewers: 0,
};
