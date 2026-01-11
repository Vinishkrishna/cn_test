import { NavLink, useLocation } from 'react-router';
import { Fragment, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import {
  LayoutDashboard,
  FolderOpen,
  Play,
  FlaskConical,
  Shield,
  FileText,
  Wallet,
  Users,
  BarChart3,
  FileStack,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '~/lib/cn';
import { useSidebar } from '~/contexts/SidebarContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  FolderOpen,
  Play,
  FlaskConical,
  Shield,
  FileText,
  Wallet,
  Users,
  BarChart3,
  FileStack,
};

const mainNavItems = [
  { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { name: 'Projects', href: '/projects', icon: 'FolderOpen' },
  { name: 'Jobs', href: '/jobs', icon: 'Play' },
  { name: 'Test Cases', href: '/test-cases', icon: 'FlaskConical' },
  { name: 'Policies & Compliance', href: '/policies', icon: 'Shield' },
  { name: 'Reports', href: '/reports', icon: 'FileText' },
];

const billingNavItems = [
  { name: 'Credits & Billing', href: '/billing', icon: 'Wallet' },
];

const adminNavItems = [
  { name: 'Test Case Management', href: '/admin/test-cases', icon: 'FlaskConical' },
  { name: 'Policy Management', href: '/admin/policies', icon: 'FileStack' },
  { name: 'User Management', href: '/admin/tenants', icon: 'Users' },
  { name: 'Usage Analytics', href: '/admin/analytics', icon: 'BarChart3' },
];

interface NavItemProps {
  item: { name: string; href: string; icon: string };
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  const Icon = iconMap[item.icon];

  return (
    <NavLink
      to={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
      <span className="truncate">{item.name}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const location = useLocation();
  const [adminOpen, setAdminOpen] = useState(() => 
    location.pathname.startsWith('/admin')
  );

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const isAdminActive = adminNavItems.some((item) => isActiveRoute(item.href));

  return (
    <>
      {/* Mobile overlay */}
      <Transition show={isOpen} as={Fragment}>
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      </Transition>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                AI Validate
              </span>
            </NavLink>
            <button
              onClick={closeSidebar}
              className="lg:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {/* Main Section */}
            <div className="mb-6">
              <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Main
              </p>
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                  />
                ))}
              </div>
            </div>

            {/* Billing Section */}
            <div className="mb-6">
              <p className="px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Billing
              </p>
              <div className="space-y-1">
                {billingNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                  />
                ))}
              </div>
            </div>

            {/* Admin Section */}
            <div>
              <Disclosure defaultOpen={isAdminActive}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      onClick={() => setAdminOpen(!adminOpen)}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isAdminActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                    >
                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Admin
                      </span>
                      {open || adminOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </Disclosure.Button>
                    <Transition
                      show={open || adminOpen}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel static className="mt-1 space-y-1">
                        {adminNavItems.map((item) => (
                          <NavItem
                            key={item.href}
                            item={item}
                            isActive={isActiveRoute(item.href)}
                          />
                        ))}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            </div>
          </nav>

          {/* Settings Link at bottom */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <NavLink
              to="/settings"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActiveRoute('/settings')
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
