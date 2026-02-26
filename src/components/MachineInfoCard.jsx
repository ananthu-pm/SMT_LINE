// ──────────────────────────────────────────────────
//  MachineInfoCard — Theme-aware overlay card
// ──────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function MachineInfoCard({ machine }) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!machine) return null;

    const statusColor = machine.status === 'running' ? '#22c55e' : machine.status === 'idle' ? '#f59e0b' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute bottom-6 right-6 w-80 rounded-2xl overflow-hidden theme-transition ${isDark
                ? 'glass-dark shadow-glass-dark'
                : 'glass-light shadow-card-light'
                }`}
        >
            {/* Header with accent bar */}
            <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${machine.color}, ${machine.color}88)` }}
            />

            <div className="p-5">
                {/* Title + Status */}
                <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl mt-0.5">{machine.icon}</span>
                    <div className="flex-1">
                        <h3 className={`font-heading text-sm tracking-wide ${isDark ? 'text-white' : 'text-lt-text'}`}>
                            {machine.name}
                        </h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                            {machine.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full animate-pulse-glow"
                            style={{ backgroundColor: statusColor, boxShadow: `0 0 8px ${statusColor}` }}
                        />
                        <span className={`text-[10px] font-mono uppercase ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                            {machine.status}
                        </span>
                    </div>
                </div>

                {/* Position indicator */}
                <div className={`mb-4 py-2 px-3 rounded-lg text-xs ${isDark
                    ? 'bg-dt-bg/60 border border-dt-border'
                    : 'bg-lt-card border border-lt-border'
                    }`}>
                    <div className="flex justify-between items-center">
                        <span className={isDark ? 'text-dt-muted' : 'text-lt-muted'}>Station Position</span>
                        <span className={`font-mono font-semibold ${isDark ? 'text-neon-blue' : 'text-accent-blue'}`}>
                            #{machine.position} of 15
                        </span>
                    </div>
                    {/* Mini progress */}
                    <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-dt-border' : 'bg-lt-border'}`}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(machine.position / 15) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${machine.color}, ${machine.color}88)` }}
                        />
                    </div>
                </div>

                {/* Specs */}
                <div className="space-y-2">
                    <div className={`text-[10px] font-heading uppercase tracking-widest mb-2 ${isDark ? 'text-dt-muted' : 'text-lt-muted'}`}>
                        Technical Specs
                    </div>
                    {machine.specs.map((spec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * (i + 1) }}
                            className={`flex items-center gap-2.5 py-2 px-3 rounded-lg text-xs ${isDark
                                ? 'bg-dt-bg/40 border border-dt-border/50'
                                : 'bg-lt-card/60 border border-lt-border/50'
                                }`}
                        >
                            <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: machine.color }}
                            />
                            <span className={isDark ? 'text-dt-text' : 'text-lt-text'}>{spec}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
