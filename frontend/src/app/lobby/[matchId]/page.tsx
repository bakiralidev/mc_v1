'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import socket from '@/utils/socket';
import api from '@/utils/api';
import { ArrowLeft, Users, Shield, Sword, Heart, Zap, Copy, CheckCircle2, Play, Loader2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LobbyPage() {
  const params = useParams();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { currentMatch, setMatch } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchLobby = async () => {
      try {
        const { data } = await api.get(`/lobby/${matchId}`);
        setMatch(data);
        
        if (!socket.connected) socket.connect();
        socket.emit('join_lobby', matchId);
        
        setLoading(false);
      } catch (err) {
        console.error("Lobby fetch failed", err);
        router.push('/');
      }
    };

    fetchLobby();

    socket.on('lobby_update', (updatedLobby) => {
      setMatch(updatedLobby);
    });

    socket.on('match_start', (data) => {
      localStorage.setItem('match_data', JSON.stringify(data));
      router.push(`/match/${matchId}`);
    });

    return () => {
      socket.off('lobby_update');
      socket.off('match_start');
    };
  }, [matchId, token, router, setMatch]);

  const copyCode = () => {
    if (currentMatch) {
      navigator.clipboard.writeText(currentMatch.lobby_code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleToggleReady = async () => {
    console.log("Toggle Ready clicked. User:", user?.id, "MyPlayer:", myPlayer?.id);
    if (!myPlayer) {
      console.warn("MyPlayer not found in match_players list");
      return;
    }

    try {
      // Optimistic update
      if (currentMatch && currentMatch.match_players) {
        const updatedMatch = { ...currentMatch };
        const playerIndex = updatedMatch.match_players.findIndex(p => p.user_id === user?.id);
        if (playerIndex !== -1) {
          const newState = !updatedMatch.match_players[playerIndex].is_ready;
          console.log("Setting optimistic ready state to:", newState);
          updatedMatch.match_players[playerIndex].is_ready = newState;
          setMatch({ ...updatedMatch } as any);
        }
      }
      
      const { data } = await api.patch(`/lobby/${matchId}/ready`);
      console.log("Ready status updated on server:", data);
    } catch (err: any) {
      console.error("Failed to toggle ready status:", err);
      // Rollback or reload
      const { data } = await api.get(`/lobby/${matchId}`);
      setMatch(data);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await api.post(`/lobby/${matchId}/teams/${teamId}/join`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectRole = async (roleId: string) => {
    try {
      await api.patch(`/lobby/${matchId}/select`, { role_id: roleId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartMatch = async () => {
    try {
      await api.post(`/lobby/${matchId}/start`);
    } catch (err: any) {
      alert("Cannot start match: " + (err.response?.data?.message || err.message));
    }
  };

  const isAdmin = currentMatch?.created_by_user_id === user?.id;
  const myPlayer = currentMatch?.match_players?.find(p => p.user_id === user?.id);

  const roles = [
    { id: 'warrior', name: 'WARRIOR', icon: Shield, color: 'from-red-500/20 to-red-900/40', text: 'text-red-400', glow: 'shadow-red-500/20', image: '/media/personajlar/warrior.png' },
    { id: 'archer', name: 'ARCHER', icon: Sword, color: 'from-green-500/20 to-green-900/40', text: 'text-green-400', glow: 'shadow-green-500/20', image: '/media/personajlar/archer.png' },
    { id: 'healer', name: 'HEALER', icon: Heart, color: 'from-blue-500/20 to-blue-900/40', text: 'text-blue-400', glow: 'shadow-blue-500/20', image: '/media/personajlar/healer.png' },
    { id: 'mage', name: 'MAGE', icon: Zap, color: 'from-purple-500/20 to-purple-900/40', text: 'text-purple-400', glow: 'shadow-purple-500/20', image: '/media/personajlar/mage.png' }
  ];

  const [selectedRolePreview, setSelectedRolePreview] = useState<any>(null);

  if (loading || !currentMatch) {
    return (
      <div className="min-h-screen bg-game-dark flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-game-gold" size={64} />
        <p className="text-white/40 font-black uppercase tracking-[0.4em] text-xs">Connecting to Lobby...</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#020617] overflow-hidden p-8 lg:p-12 font-game">
      {/* Role Preview Modal */}
      <AnimatePresence>
        {selectedRolePreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full h-[85vh] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0a0a0a]"
            >
              <img src={selectedRolePreview.image} alt={selectedRolePreview.name} className="w-full h-full object-contain" />
              <div className="absolute top-8 right-8">
                <button 
                  onClick={() => setSelectedRolePreview(null)}
                  className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                  <ArrowLeft size={24} className="rotate-90" />
                </button>
              </div>
              <div className="absolute bottom-12 left-12">
                 <button 
                   onClick={() => {
                     handleSelectRole(selectedRolePreview.id);
                     setSelectedRolePreview(null);
                   }}
                   className="game-btn-gold px-12 h-16 flex items-center gap-4 text-xl"
                 >
                   SELECT THIS ROLE
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/maze_champions_bg.png')] bg-cover bg-center opacity-10 grayscale scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,6,23,0.8)_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto h-full flex flex-col gap-10">
        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => router.push('/')} 
            className="flex items-center gap-3 text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:scale-110" /> 
            <span className="text-xs font-black uppercase tracking-[0.3em]">QUIT TO MAIN MENU</span>
          </motion.button>
          
          <div className="flex items-center gap-6">
             <div className="px-10 py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-6 shadow-2xl">
                <div>
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Lobby Access Code</p>
                   <p className="text-3xl font-black text-game-gold tracking-tighter leading-none">{currentMatch.lobby_code}</p>
                </div>
                <button onClick={copyCode} className="p-3 hover:bg-white/5 rounded-xl transition-all relative group">
                   <Copy size={22} className={copySuccess ? 'text-game-gold' : 'text-white/40 group-hover:text-white'} />
                   <AnimatePresence>
                     {copySuccess && (
                       <motion.span 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: -40 }}
                         exit={{ opacity: 0 }}
                         className="absolute left-1/2 -translate-x-1/2 text-[10px] font-black text-game-gold whitespace-nowrap bg-game-gold/10 px-2 py-1 rounded"
                       >
                         COPIED!
                       </motion.span>
                     )}
                   </AnimatePresence>
                </button>
             </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10 flex-grow">
          
          <div className="space-y-10">
             {/* TEAMS SECTION */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentMatch.teams.map((team) => (
                  <motion.div 
                    key={team.id}
                    layout
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                    <div className="game-panel p-8 bg-black/40 backdrop-blur-md border-white/5 flex flex-col gap-8 relative z-10">
                       <div className="flex justify-between items-center border-b border-white/5 pb-6">
                          <div className="flex items-center gap-4">
                             <div className="w-5 h-5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" style={{ backgroundColor: team.color }}></div>
                             <h3 className="text-2xl font-black uppercase tracking-tighter">{team.name}</h3>
                          </div>
                          <button 
                            onClick={() => handleJoinTeam(team.id)}
                            className="px-4 py-2 rounded-lg text-[10px] font-black text-game-blue hover:bg-game-blue/10 uppercase tracking-widest transition-all border border-game-blue/20"
                          >
                            SWITCH TEAM
                          </button>
                       </div>

                       <div className="grid grid-cols-1 gap-4 min-h-[220px]">
                          {currentMatch.match_players.filter(p => p.team_id === team.id).map(player => (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               key={player.id} 
                               className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${player.user_id === user?.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                             >
                                <div className="flex items-center gap-5">
                                   <div className="w-12 h-12 bg-game-dark rounded-xl flex items-center justify-center font-black text-white/40 border border-white/5">
                                      {player.user.username[0].toUpperCase()}
                                   </div>
                                   <div>
                                      <p className="font-black text-sm uppercase tracking-tight flex items-center gap-2">
                                         {player.user.username} 
                                         {player.user_id === user?.id && <span className="text-[10px] px-2 py-0.5 bg-game-gold/20 text-game-gold rounded font-black">YOU</span>}
                                      </p>
                                      <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-0.5">
                                         {player.role?.name || 'SELECTING ROLE...'}
                                      </p>
                                   </div>
                                </div>
                                {player.is_ready ? (
                                   <div className="flex items-center gap-2 text-game-gold">
                                      <span className="text-[10px] font-black tracking-widest uppercase">READY</span>
                                      <CheckCircle2 size={22} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                   </div>
                                ) : (
                                   <div className="w-6 h-6 rounded-full border-2 border-white/10 animate-pulse"></div>
                                )}
                             </motion.div>
                          ))}
                          {currentMatch.match_players.filter(p => p.team_id === team.id).length === 0 && (
                             <div className="h-full flex flex-col items-center justify-center text-white/10 py-12 gap-4">
                                <Users size={48} className="opacity-10" />
                                <span className="text-xs font-black uppercase tracking-[0.3em] italic">Open Slot</span>
                             </div>
                          )}
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>

             {/* ROLE SELECTION SECTION */}
             <div className="game-panel p-10 bg-black/40 backdrop-blur-md">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black flex items-center gap-4">
                      <Sword size={24} className="text-game-gold" />
                      <span className="uppercase tracking-[0.2em]">Master Your Class</span>
                   </h3>
                   <p className="text-xs font-bold text-white/30 uppercase tracking-widest italic">Choose your role for the upcoming match</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                   {roles.map(role => (
                      <motion.button 
                        key={role.id}
                        whileHover={{ y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRolePreview(role)}
                        className={`relative flex flex-col items-center p-8 rounded-[32px] border-2 transition-all group overflow-hidden ${myPlayer?.role_id === role.id ? `border-game-gold bg-game-gold/5 shadow-2xl ${role.glow}` : 'border-white/5 bg-white/20 hover:border-white/20'}`}
                      >
                         <div className={`absolute inset-0 bg-gradient-to-b ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                         <role.icon size={48} className={`mb-6 transition-transform group-hover:scale-125 relative z-10 ${role.text}`} />
                         <span className={`font-black text-base uppercase tracking-[0.2em] relative z-10 ${myPlayer?.role_id === role.id ? 'text-white' : 'text-white/40'}`}>
                            {role.name}
                         </span>
                         {myPlayer?.role_id === role.id && (
                            <motion.div 
                              layoutId="active-role"
                              className="absolute inset-0 border-4 border-game-gold rounded-[32px]"
                            />
                         )}
                      </motion.button>
                   ))}
                </div>
             </div>
          </div>

          {/* SIDEBAR: STATUS & ACTION */}
          <div className="flex flex-col gap-8 relative z-20">
             <div className="game-panel p-10 bg-black/60 backdrop-blur-2xl flex flex-col gap-8 border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                <div className="text-center">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Current Status</p>
                   <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleToggleReady}
                      className={`w-full py-6 rounded-[24px] font-black text-2xl tracking-[0.2em] transition-all border-b-[6px] relative z-30 shadow-2xl ${myPlayer?.is_ready ? 'bg-game-gold border-yellow-700 text-black' : 'bg-white/10 border-white/5 text-white/40 hover:bg-white/20 hover:text-white'}`}
                   >
                      {myPlayer?.is_ready ? 'READY' : 'NOT READY'}
                   </motion.button>
                </div>

                <AnimatePresence>
                  {isAdmin && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="pt-6 border-t border-white/5 space-y-4"
                    >
                       {currentMatch.match_players.length === 1 ? (
                          <div className="space-y-4">
                             <div className="p-4 bg-game-gold/10 border border-game-gold/20 rounded-2xl">
                                <p className="text-[10px] font-black text-game-gold uppercase tracking-widest text-center">
                                   Waiting for more players... or
                                </p>
                             </div>
                             <button 
                                onClick={() => handleStartMatch()}
                                className="game-btn-gold w-full h-[80px] flex flex-col items-center justify-center group shadow-[0_15px_40px_rgba(251,191,36,0.2)]"
                             >
                                <div className="flex items-center gap-4">
                                   <Sword size={24} className="text-black" />
                                   <span className="text-xl font-black italic tracking-widest">SOLO CHALLENGE</span>
                                </div>
                                <span className="text-[8px] font-black text-black/60 uppercase tracking-widest">Survive 5m or defeat the Boss</span>
                             </button>
                          </div>
                       ) : (
                          <>
                             <button 
                                onClick={handleStartMatch}
                                className="game-btn-gold w-full h-[80px] flex items-center justify-center gap-4 group shadow-[0_15px_40px_rgba(251,191,36,0.2)]"
                             >
                                <Play size={24} className="fill-current" />
                                <span className="text-2xl font-black italic tracking-widest">START MATCH</span>
                             </button>
                             <p className="text-center mt-4 text-[10px] font-black text-game-gold/40 uppercase tracking-widest">All players must be ready</p>
                          </>
                       )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="p-6 bg-game-dark/50 rounded-2xl border border-white/5 space-y-4">
                   <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Lobby Conditions</h4>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold text-white/60">Players</span>
                         <span className={`font-black ${currentMatch.match_players.length >= 2 ? 'text-game-gold' : 'text-red-500'}`}>
                            {currentMatch.match_players.length} / 12
                         </span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-game-gold transition-all duration-500" 
                           style={{ width: `${(currentMatch.match_players.length / 12) * 100}%` }}
                         />
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold text-white/60">Readiness</span>
                         <span className={`font-black ${currentMatch.match_players.every(p => p.is_ready) ? 'text-game-gold' : 'text-white/20'}`}>
                            {currentMatch.match_players.filter(p => p.is_ready).length} / {currentMatch.match_players.length}
                         </span>
                      </div>
                   </div>
                </div>
             </div>

             {/* CHAT SECTION */}
             <div className="game-panel flex-grow bg-black/40 backdrop-blur-md p-8 flex flex-col border-white/5">
                <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-game-blue animate-pulse"></div>
                   Lobby Transmission
                </h4>
                <div className="flex-grow flex flex-col items-center justify-center border-t border-white/5 pt-8 gap-4">
                   <Loader2 className="animate-spin text-white/5" size={32} />
                   <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] italic">Initializing Secure Channel...</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
