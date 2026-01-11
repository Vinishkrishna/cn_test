import { cn } from '~/lib/cn';
import type { RiskLevel } from '~/types';

export interface RiskBadgeProps {
  risk: RiskLevel | null;
  className?: string;
}

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: 'Low Risk',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  medium: {
    label: 'Medium Risk',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  high: {
    label: 'High Risk',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  if (!risk) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
          className
        )}
      >
        N/A
      </span>
    );
  }

  const config = riskConfig[risk];

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
