import { useState, Fragment } from 'react';
import { Menu, Transition, Popover } from '@headlessui/react';
import {
  Menu as MenuIcon,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  Check,
  LogOut,
  Settings,
  User,
  PanelLeft,
} from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '~/lib/cn';
import { useTheme } from '~/contexts/ThemeContext';
import { useSidebar } from '~/contexts/SidebarContext';
import { useNotifications } from '~/contexts/NotificationContext';
import { SEARCH_DEBOUNCE_MS } from '~/lib/constants';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar, toggleCollapse } = useSidebar();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebouncedCallback((query: string) => {
    // Search logic placeholder - would connect to backend
    console.log('Searching for:', query);
  }, SEARCH_DEBOUNCE_MS);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          {/* Tenant Selector */}
          <Menu as="div" className="relative hidden sm:block">
            <Menu.Button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span>DE | DEFAULT</span>
              <ChevronDown className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none">
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md',
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        )}
                      >
                        <Check className="h-4 w-4 text-indigo-600" />
                        <span>DE | DEFAULT</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Global Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={cn(
                'w-64 lg:w-80 pl-10 pr-4 py-2 rounded-lg border text-sm',
                'bg-gray-50 dark:bg-gray-800',
                'border-gray-200 dark:border-gray-700',
                'text-gray-900 dark:text-gray-100',
                'placeholder-gray-400 dark:placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              )}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <Popover className="relative">
            <Popover.Button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          'w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors',
                          !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                              notification.type === 'success' && 'bg-green-500',
                              notification.type === 'warning' && 'bg-amber-500',
                              notification.type === 'error' && 'bg-red-500',
                              notification.type === 'info' && 'bg-blue-500'
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">TA</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tenant Admin
              </span>
              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none">
                <div className="p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300',
                          active && 'bg-gray-100 dark:bg-gray-700'
                        )}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/settings"
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-700 dark:text-gray-300',
                          active && 'bg-gray-100 dark:bg-gray-700'
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400',
                          active && 'bg-gray-100 dark:bg-gray-700'
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
