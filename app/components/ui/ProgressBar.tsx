import { cn } from '~/lib/cn';

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'green' | 'amber' | 'red';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'indigo',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
          size === 'sm' && 'h-1.5',
          size === 'md' && 'h-2',
          size === 'lg' && 'h-3'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            color === 'indigo' && 'bg-indigo-600 dark:bg-indigo-500',
            color === 'green' && 'bg-green-600 dark:bg-green-500',
            color === 'amber' && 'bg-amber-600 dark:bg-amber-500',
            color === 'red' && 'bg-red-600 dark:bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
