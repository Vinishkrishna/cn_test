import type { Project } from '~/types';

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'ChatBot v2.0',
    description: 'Customer service chatbot using GPT-4',
    aiSystemType: 'llm',
    status: 'active',
    jobsCount: 45,
    lastValidation: '2026-01-08',
  },
  {
    id: 'proj-2',
    name: 'Medical Assistant AI',
    description: 'Healthcare diagnostic support system',
    aiSystemType: 'multimodal',
    status: 'active',
    jobsCount: 28,
    lastValidation: '2026-01-08',
  },
  {
    id: 'proj-3',
    name: 'Document Analyzer',
    description: 'Legal document processing and analysis',
    aiSystemType: 'llm',
    status: 'active',
    jobsCount: 62,
    lastValidation: '2026-01-07',
  },
  {
    id: 'proj-4',
    name: 'HR Screening Tool',
    description: 'Resume screening and candidate matching',
    aiSystemType: 'llm',
    status: 'active',
    jobsCount: 15,
    lastValidation: '2026-01-06',
  },
  {
    id: 'proj-5',
    name: 'Vision Inspector',
    description: 'Quality control image analysis system',
    aiSystemType: 'multimodal',
    status: 'draft',
    jobsCount: 0,
    lastValidation: null,
  },
];
