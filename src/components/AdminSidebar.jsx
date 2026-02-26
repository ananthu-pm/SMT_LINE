// ──────────────────────────────────────────────────
//  AdminSidebar — 15 Machines + Broadcast Controls
// ──────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import useMachineStore from '../store/useMachineStore';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function AdminSidebar() {
    const machines = useMachineStore((s) => s.machines);
    const activeMachineId = useMachineStore((s) => s.activeMachineId);
    const broadcastMachine = useMachineStore((s) => s.broadcastMachine);
    const releaseControl = useMachineStore((s) => s.releaseControl);
    const isBroadcasting = useMachineStore((s) => s.isBroadcasting);
    const isConnected = useMachineStore((s) => s.isConnected);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`w-80 h-full flex flex-col theme-transition ${isDark
            ? 'bg-dt-surface border-r border-dt-border'
            : 'bg-lt-surface border-r border-lt-border shadow-sm'
            }`}>
            {/* Header */}
            <div className={`p-4 border-b ${isDark ? 'border-dt-border' : 'border-lt-border'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark
                            ? 'bg-accent-purple/10 border border-accent-purple/20'
                            : 'bg-accent-indigo/10 border border-accent-indigo/20'
                            }`}>
                            <span className="text-lg">🛡️</span>
                        </div>
                        <div>
                            <h2 className={`font-heading text-xs tracking-wider ${isDark ? 'text-white' : 'text-lt-text'}`}>
                                ADMIN CONTROL
                            </h2>
                            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                                Master Control Panel
                            </p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Connection + Release */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: isConnected ? '#22c55e' : '#ef4444',
                                boxShadow: `0 0 6px ${isConnected ? '#22c55e' : '#ef4444'}`,
                            }}
                        />
                        <span className={`text-[10px] font-mono uppercase ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    {isBroadcasting && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={releaseControl}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-heading uppercase tracking-wider transition-colors ${isDark
                                ? 'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20'
                                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                }`}
                        >
                            ✕ Release
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Machine list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {machines.map((machine, index) => {
                    const isActive = machine.id === activeMachineId;
                    return (
                        <motion.div
                            key={machine.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <button
                                onClick={() => broadcastMachine(machine.id)}
                                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group ${isActive
                                    ? isDark
                                        ? 'bg-neon-blue/5 border-neon-blue/30 shadow-neon-blue'
                                        : 'bg-accent-blue/5 border-accent-blue/30 shadow-sm'
                                    : isDark
                                        ? 'bg-dt-card border-dt-border hover:border-dt-border/80 hover:bg-dt-card/80'
                                        : 'bg-lt-card border-lt-border hover:border-lt-border/80 hover:bg-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${isDark ? 'bg-dt-bg/60' : 'bg-lt-bg/80'
                                        }`}
                                        style={{
                                            borderLeft: `3px solid ${machine.color}`,
                                        }}
                                    >
                                        {machine.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-lt-text'}`}>
                                                {machine.name}
                                            </h3>
                                            <span className={`text-[9px] font-mono ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                                                #{machine.position}
                                            </span>
                                        </div>
                                        <p className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                                            {machine.description}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`w-2 h-2 rounded-full flex-shrink-0 ${isDark ? 'bg-neon-blue' : 'bg-accent-blue'}`}
                                            style={{ boxShadow: `0 0 8px ${isDark ? '#00b4ff' : '#3b82f6'}` }}
                                        />
                                    )}
                                </div>
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${isDark ? 'border-dt-border' : 'border-lt-border'}`}>
                <div className={`text-[10px] font-mono text-center ${isDark ? 'text-white/15' : 'text-lt-muted/50'}`}>
                    SMT DIGITAL TWIN v2.0 — {machines.length} STATIONS
                </div>
            </div>
        </div>
    );
}
