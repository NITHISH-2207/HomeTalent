import { useNotificationContext } from '../context/NotificationContext.jsx';

export const useNotifications = () => {
  return useNotificationContext();
};

export default useNotifications;
