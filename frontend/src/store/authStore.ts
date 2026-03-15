import { create } from 'zustand';

interface AuthStore {
  token: string | null;
  isAdmin: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const STORAGE_KEY = 'admin_token';

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem(STORAGE_KEY),
  isAdmin: !!localStorage.getItem(STORAGE_KEY),
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEY, token);
    set({ token, isAdmin: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, isAdmin: false });
  },
}));
