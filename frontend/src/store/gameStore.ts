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
  setMatch: (match: Match | null) => void;
  updatePlayer: (player: Player) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentMatch: null,
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
}));
