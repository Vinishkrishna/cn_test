import type { ReactNode } from 'react';
import { cn } from '~/lib/cn';

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead
      className={cn(
        'bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>{children}</tbody>;
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors',
        className
      )}
    >
      {children}
    </tr>
  );
}

export interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
}

export function TableCell({ children, className, isHeader }: TableCellProps) {
  const Component = isHeader ? 'th' : 'td';
  return (
    <Component
      className={cn(
        'px-4 py-3 text-sm',
        isHeader
          ? 'font-medium text-gray-500 dark:text-gray-400 text-left'
          : 'text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </Component>
  );
}
