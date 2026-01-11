import type { ReactNode } from 'react';
import { cn } from '~/lib/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  valueColor?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  valueColor = 'default',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p
            className={cn(
              'mt-2 text-3xl font-bold',
              valueColor === 'default' && 'text-gray-900 dark:text-white',
              valueColor === 'success' && 'text-green-600 dark:text-green-400',
              valueColor === 'warning' && 'text-amber-600 dark:text-amber-400',
              valueColor === 'danger' && 'text-red-600 dark:text-red-400'
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.value >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
