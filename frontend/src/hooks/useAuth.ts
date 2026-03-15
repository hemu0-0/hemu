import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { token, isAdmin, setToken, logout } = useAuthStore();
  return { token, isAdmin, setToken, logout };
};
