// ──────────────────────────────────────────────────
//  AdminView — Sidebar + 3D Preview
// ──────────────────────────────────────────────────

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import HomeScene3D from '../components/HomeScene3D';
import MachineDetailScene from '../components/MachineDetailScene';
import MachineInfoCard from '../components/MachineInfoCard';
import useMachineStore from '../store/useMachineStore';
import { useTheme } from '../context/ThemeContext';

export default function AdminView() {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());
    const isBroadcasting = useMachineStore((s) => s.isBroadcasting);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen w-screen flex overflow-hidden transition-colors duration-500 ${isDark ? 'bg-dt-bg' : 'bg-lt-bg'}`}>
            {/* Left sidebar */}
            <AdminSidebar />

            {/* Right — 3D viewport + overlays */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeMachine ? (
                        <motion.div
                            key={activeMachine.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full"
                        >
                            <MachineDetailScene machine={activeMachine} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
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

                {/* Admin badge */}
                <div className="absolute bottom-5 left-5">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full theme-transition ${isDark
                        ? 'bg-accent-purple/10 border border-accent-purple/20'
                        : 'bg-accent-indigo/10 border border-accent-indigo/20'
                        }`}>
                        <div
                            className="w-2 h-2 rounded-full animate-pulse-glow"
                            style={{ backgroundColor: isDark ? '#a855f7' : '#6366f1', boxShadow: `0 0 8px ${isDark ? '#a855f7' : '#6366f1'}` }}
                        />
                        <span className={`text-[10px] font-heading uppercase tracking-widest ${isDark ? 'text-accent-purple' : 'text-accent-indigo'}`}>
                            Admin Mode
                        </span>
                    </div>
                </div>

                {/* Broadcasting banner */}
                <AnimatePresence>
                    {isBroadcasting && activeMachine && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-5 left-1/2 -translate-x-1/2"
                        >
                            <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full theme-transition ${isDark
                                ? 'glass-dark border border-neon-blue/20'
                                : 'glass-light border border-accent-blue/20 shadow-sm'
                                }`}>
                                <div className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
                                <span className={`text-xs font-heading uppercase tracking-wider ${isDark ? 'text-neon-blue' : 'text-accent-blue'}`}>
                                    Broadcasting: {activeMachine.name}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Home title when no machine selected */}
                <AnimatePresence>
                    {!activeMachine && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-5 left-1/2 -translate-x-1/2"
                        >
                            <div className={`px-6 py-2.5 rounded-full theme-transition ${isDark
                                ? 'glass-dark border border-dt-border'
                                : 'glass-light border border-lt-border shadow-sm'
                                }`}>
                                <h1 className={`font-heading text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-lt-text'}`}>
                                    SMT Line Overview
                                </h1>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
