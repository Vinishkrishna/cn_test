import type { Transaction } from '~/types';

export const billingStats = {
  creditsBalance: 4250,
  estimatedJobs: 85,
  usedThisMonth: 1750,
  monthlyLimit: 6000,
  unitPrice: 0.05,
};

export const transactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Credit Purchase',
    credits: 5000,
    date: '2024-12-15',
    hasInvoice: true,
  },
  {
    id: 'tx-2',
    description: 'GPT-4 Bias Validation',
    credits: -48,
    date: '2024-12-20',
    hasInvoice: false,
  },
  {
    id: 'tx-3',
    description: 'Safety Compliance Check',
    credits: -36,
    date: '2024-12-21',
    hasInvoice: false,
  },
];
