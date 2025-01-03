'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { notificationsService, Notification } from '../services/notifications.service';
import { format } from 'date-fns';

export const NotificationMenu = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsService.getUnread();
      setNotifications(response.data.data);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // 1분마다 알림 갱신
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      await notificationsService.markAsRead(notification.id);
      if (notification.type === 'INQUIRY_ANSWERED' || notification.type === 'NEW_INQUIRY') {
        router.push(`/inquiries/${notification.relatedId}`);
      } else if (notification.type === 'SCHEDULE') {
        router.push(`/groups/schedule/${notification.relatedId}`);
      }
      handleClose();
      fetchNotifications();
    } catch (error) {
      console.error('알림 처리 실패:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications([]);
      handleClose();
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        {notifications.length > 0 ? (
          <>
            <Box sx={{ p: 1, textAlign: 'right' }}>
              <Button size="small" onClick={handleMarkAllAsRead}>
                모두 읽음 처리
              </Button>
            </Box>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{ whiteSpace: 'normal', py: 1 }}
              >
                <Box>
                  <Typography variant="subtitle2" component="div">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(notification.createdAt), 'yyyy-MM-dd HH:mm')}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </>
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              새로운 알림이 없습니다
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}; 