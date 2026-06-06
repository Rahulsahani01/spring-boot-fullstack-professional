import {successNotification, errorNotification} from '../Notification';

export function useNotification() {
  return {
    success: (message, description) => successNotification(message, description || ''),
    error: (message, description) => errorNotification(message, description || ''),
  };
}

