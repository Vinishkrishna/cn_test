import type {
  AdminPolicyStats,
  AdminTestCaseStats,
  AdminUserStats,
  TeamMember,
} from '~/types';

export const adminTestCaseStats: AdminTestCaseStats = {
  totalTestCases: 24,
  published: 18,
  drafts: 6,
  totalUnits: 52,
};

export const adminPolicyStats: AdminPolicyStats = {
  totalPolicies: 5,
  indexed: 3,
  totalArticles: 151,
  storageUsed: '17.5 MB',
};

export const adminUserStats: AdminUserStats = {
  totalMembers: 0,
  tenantAdmins: 0,
  projectManagers: 0,
  viewers: 0,
};

export const teamMembers: TeamMember[] = [];

