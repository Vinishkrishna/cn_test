import type { Policy } from '~/types';

export const policies: Policy[] = [
  {
    id: 'pol-1',
    name: 'EU AI Act - Full Text',
    description: 'Complete European Union AI Act regulation document',
    version: 'v2.1',
    status: 'indexed',
    articles: 85,
    uploaded: '2026-01-05',
    uploader: 'John Doe',
    size: 4200000,
  },
  {
    id: 'pol-2',
    name: 'Internal AI Ethics Guidelines',
    description: 'Company-wide AI ethics and governance policies',
    version: 'v1.3',
    status: 'indexed',
    articles: 24,
    uploaded: '2025-12-31',
    uploader: 'Jane Smith',
    size: 1800000,
  },
  {
    id: 'pol-3',
    name: 'GDPR Compliance Framework',
    description: 'Data protection requirements for AI systems',
    version: 'v1.0',
    status: 'indexed',
    articles: 42,
    uploaded: '2025-12-15',
    uploader: 'Admin',
    size: 3500000,
  },
  {
    id: 'pol-4',
    name: 'Healthcare AI Standards',
    description: 'Medical device and healthcare AI regulations',
    version: 'v1.0',
    status: 'processing',
    articles: 0,
    uploaded: '2026-01-10',
    uploader: 'John Doe',
    size: 5100000,
  },
];

export const policyStats = {
  totalPolicies: 5,
  indexed: 3,
  totalArticles: 151,
  storageUsed: 17500000,
};

export const processingQueue: Array<{
  id: string;
  name: string;
  progress: number;
  status: string;
}> = [];
