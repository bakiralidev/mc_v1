import { create } from 'zustand';

interface Player {
  id: string;
  user_id: string;
  username: string;
  team_id: string | null;
  role_id: string | null;
  is_ready: boolean;
  user: {
    username: string;
  };
  role?: {
    name: string;
  };
}

interface Team {
  id: string;
  name: string;
  color: string;
}

interface Match {
  id: string;
  lobby_code: string;
  status: string;
  created_by_user_id: string;
  match_players: Player[];
  teams: Team[];
}

interface GameState {
  currentMatch: Match | null;
  cameraMode: 'FIRST_PERSON' | 'THIRD_PERSON';
  setMatch: (match: Match | null) => void;
  updatePlayer: (player: Player) => void;
  setCameraMode: (mode: 'FIRST_PERSON' | 'THIRD_PERSON') => void;
  toggleCameraMode: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentMatch: null,
  cameraMode: (typeof window !== 'undefined' && localStorage.getItem('maze_camera_mode') as any) || 'THIRD_PERSON',
  setMatch: (match) => set({ currentMatch: match }),
  updatePlayer: (updatedPlayer) => set((state) => {
    if (!state.currentMatch) return state;
    return {
      currentMatch: {
        ...state.currentMatch,
        match_players: state.currentMatch.match_players.map(p => 
          p.user_id === updatedPlayer.user_id ? { ...p, ...updatedPlayer } : p
        )
      }
    };
  }),
  setCameraMode: (mode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('maze_camera_mode', mode);
    }
    set({ cameraMode: mode });
  },
  toggleCameraMode: () => set((state) => {
    const newMode = state.cameraMode === 'FIRST_PERSON' ? 'THIRD_PERSON' : 'FIRST_PERSON';
    if (typeof window !== 'undefined') {
      localStorage.setItem('maze_camera_mode', newMode);
    }
    return { cameraMode: newMode };
  }),
}));
