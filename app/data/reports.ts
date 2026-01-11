import type { Report } from '~/types';

export const reports: Report[] = [
  {
    id: 'rep-1',
    name: 'Q4 2024 Compliance Report',
    type: 'compliance',
    project: 'ChatBot v2.0',
    generated: '2026-01-09',
    size: '2.4 MB',
  },
  {
    id: 'rep-2',
    name: 'EU AI Act Audit - Medical AI',
    type: 'audit',
    project: 'Medical Assistant AI',
    generated: '2026-01-08',
    size: '5.1 MB',
  },
  {
    id: 'rep-3',
    name: 'Monthly Validation Summary',
    type: 'summary',
    project: 'All Projects',
    generated: '2026-01-07',
    size: '1.8 MB',
  },
  {
    id: 'rep-4',
    name: 'HR Screening Compliance Audit',
    type: 'audit',
    project: 'HR Screening Tool',
    generated: '2026-01-11',
    size: '',
  },
];

export const reportStats = {
  reportsGenerated: 47,
  auditReports: 12,
  lastGenerated: {
    date: '2026-01-10',
    name: 'Q4 Compliance Report',
  },
};
