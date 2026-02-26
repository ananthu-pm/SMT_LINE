// ──────────────────────────────────────────────────
//  UserView — Follower viewport with transitions
// ──────────────────────────────────────────────────

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScene3D from '../components/HomeScene3D';
import MachineDetailScene from '../components/MachineDetailScene';
import MachineInfoCard from '../components/MachineInfoCard';
import ThemeToggle from '../components/ThemeToggle';
import useMachineStore from '../store/useMachineStore';
import { useTheme } from '../context/ThemeContext';

export default function UserView() {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());
    const isConnected = useMachineStore((s) => s.isConnected);
    const isBroadcasting = useMachineStore((s) => s.isBroadcasting);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen w-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-dt-bg' : 'bg-lt-bg'}`}>
            {/* 3D viewport — transitions between Home and Machine Detail */}
            <AnimatePresence mode="wait">
                {activeMachine ? (
                    <motion.div
                        key={activeMachine.id}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <MachineDetailScene machine={activeMachine} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <HomeScene3D />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Machine info overlay */}
            <AnimatePresence>
                {activeMachine && <MachineInfoCard machine={activeMachine} />}
            </AnimatePresence>

            {/* Top bar — Machine name or Overview title */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none">
                <AnimatePresence mode="wait">
                    {activeMachine ? (
                        <motion.div
                            key={activeMachine.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className={`px-6 py-2.5 rounded-full theme-transition ${isDark
                                ? 'glass-dark border border-dt-border'
                                : 'glass-light border border-lt-border shadow-sm'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{activeMachine.icon}</span>
                                <h1 className={`font-heading text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-lt-text'}`}>
                                    {activeMachine.name}
                                </h1>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                            className={`px-6 py-2.5 rounded-full theme-transition ${isDark
                                ? 'glass-dark border border-dt-border'
                                : 'glass-light border border-lt-border shadow-sm'
                                }`}
                        >
                            <h1 className={`font-heading text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-lt-text'}`}>
                                ⚡ SMT Line Overview
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Theme toggle — top right */}
            <div className="absolute top-5 right-5">
                <ThemeToggle />
            </div>

            {/* Follower mode + Connection status — bottom left */}
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
                {/* Connection indicator */}
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full theme-transition ${isDark
                    ? 'glass-dark border border-dt-border'
                    : 'glass-light border border-lt-border shadow-sm'
                    }`}>
                    <div
                        className="w-2 h-2 rounded-full animate-pulse-glow"
                        style={{
                            backgroundColor: isConnected ? '#22c55e' : '#ef4444',
                            boxShadow: `0 0 6px ${isConnected ? '#22c55e' : '#ef4444'}`,
                        }}
                    />
                    <span className={`text-[10px] font-mono uppercase ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                        {isConnected ? 'Synced' : 'Reconnecting...'}
                    </span>
                </div>

                {/* Follower badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full theme-transition ${isDark
                    ? 'bg-neon-blue/5 border border-neon-blue/15'
                    : 'bg-accent-blue/5 border border-accent-blue/15'
                    }`}>
                    <span className={`text-[10px] font-heading uppercase tracking-widest ${isDark ? 'text-neon-blue/60' : 'text-accent-blue/70'}`}>
                        👁 Follower Mode
                    </span>
                </div>
            </div>

            {/* Waiting for broadcast indicator (when on overview) */}
            <AnimatePresence>
                {!activeMachine && isConnected && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-5 left-1/2 -translate-x-1/2"
                    >
                        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl theme-transition ${isDark
                            ? 'glass-dark border border-dt-border'
                            : 'glass-light border border-lt-border shadow-sm'
                            }`}>
                            <div className={`w-3 h-3 rounded-full animate-pulse ${isDark ? 'bg-neon-blue/40' : 'bg-accent-blue/40'}`} />
                            <span className={`text-xs ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                                Waiting for admin to broadcast a station...
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
