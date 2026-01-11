import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '~/lib/cn';
import { SEARCH_DEBOUNCE_MS } from '~/lib/constants';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  value,
  onChange,
  className,
}: SearchInputProps) {
  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, SEARCH_DEBOUNCE_MS);

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => debouncedOnChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'block w-full pl-10 pr-3 py-2 rounded-lg border transition-colors duration-200',
          'bg-white dark:bg-gray-800',
          'border-gray-300 dark:border-gray-600',
          'text-gray-900 dark:text-gray-100',
          'placeholder-gray-400 dark:placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
        )}
      />
    </div>
  );
}
