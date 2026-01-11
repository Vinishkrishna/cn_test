import { Switch } from '@headlessui/react';
import { cn } from '~/lib/cn';

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export function Toggle({ enabled, onChange, label, description, className }: ToggleProps) {
  return (
    <Switch.Group as="div" className={cn('flex items-center justify-between', className)}>
      <span className="flex flex-grow flex-col">
        {label && (
          <Switch.Label as="span" className="text-sm font-medium text-gray-900 dark:text-white" passive>
            {label}
          </Switch.Label>
        )}
        {description && (
          <Switch.Description as="span" className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </Switch.Description>
        )}
      </span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
          enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
