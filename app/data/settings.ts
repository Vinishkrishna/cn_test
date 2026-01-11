import type { NotificationSettings, UserProfile } from '~/types';

export const userProfile: UserProfile = {
  firstName: 'Tenant',
  lastName: 'Admin',
  email: 'admin@company.com',
};

export const notificationSettings: NotificationSettings = {
  jobCompleted: true,
  jobFailed: true,
  creditsLow: true,
  policyUpdates: false,
};

export const apiKey = {
  masked: 'sk-****************************a1b2',
  lastGenerated: '2024-11-15',
};

