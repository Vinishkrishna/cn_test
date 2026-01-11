import { cn } from '~/lib/cn';
import { Button } from '~/components/ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && (
        <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}

