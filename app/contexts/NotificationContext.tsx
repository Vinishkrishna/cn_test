import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Notification } from '~/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Job Completed',
    message: 'GPT-4 Bias Validation completed successfully',
    type: 'success',
    read: false,
    created: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Credits Low',
    message: 'Your credits are running low. Consider purchasing more.',
    type: 'warning',
    read: false,
    created: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Policy Update',
    message: 'EU AI Act document has been indexed successfully',
    type: 'info',
    read: true,
    created: new Date().toISOString(),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'created'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      created: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
