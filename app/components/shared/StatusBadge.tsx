import { cn } from '~/lib/cn';
import type { JobStatus, PolicyStatus, TestCaseStatus, ProjectStatus } from '~/types';

type Status = JobStatus | PolicyStatus | TestCaseStatus | ProjectStatus;

export interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  // Job statuses
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  running: {
    label: 'Running',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  // Policy statuses
  indexed: {
    label: 'Indexed',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  processing: {
    label: 'Processing',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  // Test case statuses
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
