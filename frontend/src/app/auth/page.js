'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Lock, Gamepad2, Loader2, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const { data } = await api.post(endpoint, formData);
            
            setToken(data.token);
            setUser(data.user);
            
            // Redirect to home page (where the main menu is)
            router.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/guest');
            setToken(data.token);
            setUser(data.user);
            router.push('/');
        } catch (err) {
            setError('Guest login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-screen bg-game-dark flex items-center justify-center p-6 relative overflow-hidden font-game">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110 animate-slow-pan opacity-100"
                  style={{ backgroundImage: "url('/media/backgrounds/homebackgroun.png')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,6,23,0.3)_100%)]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[480px]"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-6 shadow-2xl backdrop-blur-md"
                    >
                        <Gamepad2 size={48} className="text-game-gold" />
                    </motion.div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2 uppercase">Maze Champions</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Enter the arena and survive</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    
                    {/* Tabs */}
                    <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${isLogin ? 'bg-game-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            <LogIn size={16} /> Login
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${!isLogin ? 'bg-game-gold text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            <UserPlus size={16} /> Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="relative group"
                                >
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-game-gold transition-colors" size={20} />
                                    <input 
                                        type="text"
                                        placeholder="Username"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-game-gold focus:bg-white/10 outline-none transition-all font-bold"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-game-gold transition-colors" size={20} />
                            <input 
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-game-gold focus:bg-white/10 outline-none transition-all font-bold"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-game-gold transition-colors" size={20} />
                            <input 
                                type="password"
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-game-gold focus:bg-white/10 outline-none transition-all font-bold"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-5 bg-white hover:bg-game-gold text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10"></span>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
                            <span className="bg-[#0a0f1e] px-4 text-white/30">Or continue as</span>
                        </div>
                    </div>

                    {/* Guest Login */}
                    <button 
                        onClick={handleGuestLogin}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"
                    >
                        <User size={18} className="text-white/40 group-hover:text-black" /> 
                        <span>Guest Player</span>
                    </button>
                </div>
            </motion.div>
        </main>
    );
}
