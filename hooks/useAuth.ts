
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const state = useAuthStore();
  return state;
};
