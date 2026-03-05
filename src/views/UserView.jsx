// ──────────────────────────────────────────────────
//  UserView — Follower viewport with transitions
// ──────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HomeScene3D from '../components/HomeScene3D';
import MachineDetailScene from '../components/MachineDetailScene';
import MachineInfoCard from '../components/MachineInfoCard';

import RobotAssistant from '../components/RobotAssistant';
import useMachineStore from '../store/useMachineStore';
import { useTheme } from '../context/ThemeContext';

export default function UserView() {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());
    const activeMachineId = useMachineStore((s) => s.activeMachineId);
    const isConnected = useMachineStore((s) => s.isConnected);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Track when 3D model has finished loading
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const handleModelLoaded = useCallback(() => {
        setIsModelLoaded(true);
    }, []);

    // Reset model loaded state when machine changes
    const handleSceneChange = useCallback(() => {
        setIsModelLoaded(false);
    }, []);

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
                        onAnimationStart={handleSceneChange}
                    >
                        <MachineDetailScene machine={activeMachine} onModelLoaded={handleModelLoaded} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                        onAnimationStart={handleSceneChange}
                    >
                        <HomeScene3D onModelLoaded={handleModelLoaded} />
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
                                <img src={activeMachine.icon} alt="" className="w-6 h-6 object-contain" />
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
                                <img src="/assets/icons/smt-line.png" alt="" className="w-5 h-5 object-contain inline-block mr-1" /> SMT Line Overview
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* L&T Company Logo — top left */}
            <div className="absolute top-4 left-5 z-20">
                <img src="/assets/lt-logo.png" alt="L&T" className="object-contain" style={{ height: '60px', filter: isDark ? 'brightness(1.5)' : 'none' }} />
            </div>



            {/* Robot Assistant — bottom left */}
            <RobotAssistant
                activeMachineId={activeMachineId}
                isModelLoaded={isModelLoaded}
            />

            {/* Connection status — bottom right (moved from bottom-left to avoid robot) */}
            <div className="absolute bottom-5 right-5 flex flex-col items-end gap-2" style={{ bottom: '340px' }}>
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

                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full theme-transition ${isDark
                    ? 'bg-neon-blue/5 border border-neon-blue/15'
                    : 'bg-accent-blue/5 border border-accent-blue/15'
                    }`}>
                    <span className={`text-[10px] font-heading uppercase tracking-widest ${isDark ? 'text-neon-blue/60' : 'text-accent-blue/70'}`}>
                        👁 Follower Mode
                    </span>
                </div>
            </div>
        </div>
    );
}
