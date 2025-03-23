import React, { useState, useCallback, useEffect } from 'react';
import { Box, Badge, Button, Typography, Popover, Divider, List, ListSubheader, ListItemButton, ListItemAvatar, Avatar, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fToNow } from 'src/utils/format-time';

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isUnRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
};

export type NotificationsPopoverProps = {
  data?: NotificationItemProps[];  // Optional prop for notifications data
};

export function NotificationsPopover({ data }: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(data || []);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // Fetch notifications from the API if no data is provided
  useEffect(() => {
    if (!data) {
      axios.get('https://smartbin-backend.onrender.com/api/notifications')
        .then((response) => {
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error);
        });
    }
  }, [data]);

  const handleMarkAsRead = (id: string) => {
    axios.put(`https://smartbin-backend.onrender.com/api/notifications/${id}`)
      .then(() => {
        // Update the notification status locally
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.id === id ? { ...notification, isUnRead: false } : notification
          )
        );
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  };

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  return (
    <>
      <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>New</ListSubheader>}>
            {notifications.filter(notification => notification.isUnRead).map(notification => (
              <NotificationItem key={notification.id} notification={notification} onClick={handleMarkAsRead} />
            ))}
          </List>

          <List disablePadding subheader={<ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>Before that</ListSubheader>}>
            {notifications.filter(notification => !notification.isUnRead).map(notification => (
              <NotificationItem key={notification.id} notification={notification} onClick={handleMarkAsRead} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit">
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}

function NotificationItem({ notification, onClick }: { notification: NotificationItemProps; onClick: (id: string) => void }) {
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() => onClick(notification.id)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }} />
      </ListItemAvatar>
      <ListItemText
        primary={notification.title}
        secondary={
          <Typography variant="caption" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', color: 'text.disabled' }}>
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
