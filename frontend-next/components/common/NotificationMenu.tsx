'use client';

import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleMenu = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length === 0) {
      await fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
      if (response.ok) {
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">알림</h3>
            {isLoading ? (
              <div className="py-4">
                <LoadingSpinner size="small" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">새로운 알림이 없습니다</p>
            ) : (
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 