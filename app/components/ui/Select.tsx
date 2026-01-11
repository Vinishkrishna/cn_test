import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '~/lib/cn';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: readonly SelectOption[] | SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
  error,
}: SelectProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full cursor-pointer rounded-lg py-2 pl-3 pr-10 text-left',
              'bg-white dark:bg-gray-800',
              'border border-gray-300 dark:border-gray-600',
              'text-gray-900 dark:text-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              error && 'border-red-500 focus:ring-red-500'
            )}
          >
            <span className={cn('block truncate', !selectedOption && 'text-gray-400 dark:text-gray-500')}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg py-1',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'shadow-lg focus:outline-none'
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100'
                        : 'text-gray-900 dark:text-gray-100'
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={cn('block truncate', selected && 'font-medium')}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
