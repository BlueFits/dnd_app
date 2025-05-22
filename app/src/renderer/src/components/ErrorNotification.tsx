import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert, Stack } from '@mui/material';
import { RootState } from '../store/store';
import { removeNotification } from '../store/errorSlice';

const NotificationComponent: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notification.notifications);

  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000); // Auto remove after 5 seconds

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => dispatch(removeNotification(notification.id))}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default NotificationComponent;
