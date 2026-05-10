import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  level?: number;
  xp?: number;
  is_guest: boolean;
  stats: {
    level: number;
    xp: number;
    wins: number;
    kills: number;
    deaths: number;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== 'undefined' ? (function() {
    const data = localStorage.getItem('maze_user');
    if (!data || data === 'undefined') return null;
    try { return JSON.parse(data); } catch(e) { return null; }
  })() : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('maze_token') : null,
  setUser: (user) => {
    localStorage.setItem('maze_user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    if (token) localStorage.setItem('maze_token', token);
    else localStorage.removeItem('maze_token');
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('maze_token');
    localStorage.removeItem('maze_user');
    set({ user: null, token: null });
  },
}));
