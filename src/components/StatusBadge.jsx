// ──────────────────────────────────────────────────
//  StatusBadge — Colored status indicator
// ──────────────────────────────────────────────────

import React from 'react';

const STATUS_CONFIG = {
    running: {
        color: '#39ff14',
        label: 'Running',
        bgClass: 'bg-neon-green/10',
        textClass: 'text-neon-green',
        borderClass: 'border-neon-green/30',
    },
    idle: {
        color: '#f0e130',
        label: 'Idle',
        bgClass: 'bg-neon-yellow/10',
        textClass: 'text-neon-yellow',
        borderClass: 'border-neon-yellow/30',
    },
    error: {
        color: '#ff3131',
        label: 'Error / E-Stop',
        bgClass: 'bg-neon-red/10',
        textClass: 'text-neon-red',
        borderClass: 'border-neon-red/30',
    },
};

export default function StatusBadge({ status = 'idle' }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${config.bgClass} ${config.textClass} ${config.borderClass}`}
        >
            <div
                className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
                style={{
                    backgroundColor: config.color,
                    boxShadow: `0 0 6px ${config.color}`,
                }}
            />
            {config.label}
        </div>
    );
}
