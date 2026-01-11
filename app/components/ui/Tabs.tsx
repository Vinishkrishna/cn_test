import { Tab } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';
import { cn } from '~/lib/cn';

export interface TabItem {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  className?: string;
  defaultIndex?: number;
}

export function Tabs({ tabs, className, defaultIndex = 0 }: TabsProps) {
  return (
    <Tab.Group defaultIndex={defaultIndex}>
      <Tab.List
        className={cn(
          'flex space-x-1 border-b border-gray-200 dark:border-gray-700',
          className
        )}
      >
        {tabs.map((tab, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              <button
                className={cn(
                  'px-4 py-2.5 text-sm font-medium outline-none transition-colors',
                  'border-b-2 -mb-px',
                  selected
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {tab.label}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab, index) => (
          <Tab.Panel key={index}>{tab.content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
