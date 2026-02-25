// ──────────────────────────────────────────────────
//  OEEWidget — Overall Equipment Effectiveness
// ──────────────────────────────────────────────────

import React from 'react';
import useMachineStore from '../store/useMachineStore';

function GaugeRing({ label, value, color, size = 56 }) {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    {/* Background ring */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="3"
                    />
                    {/* Value ring */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{
                            filter: `drop-shadow(0 0 4px ${color})`,
                            transition: 'stroke-dashoffset 0.8s ease-out',
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold" style={{ color }}>
                        {value.toFixed(1)}
                    </span>
                </div>
            </div>
            <span className="text-[9px] text-white/40 uppercase tracking-wider">{label}</span>
        </div>
    );
}

export default function OEEWidget() {
    const activeMachine = useMachineStore((s) => s.getActiveMachine());
    const { availability, performance, quality } = activeMachine.oee;
    const oeeTotal = ((availability * performance * quality) / 10000).toFixed(1);

    return (
        <div className="absolute top-4 right-4 animate-fade-in">
            <div className="bg-cyber-surface/70 backdrop-blur-xl border border-cyber-border rounded-xl p-3 shadow-glass">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cyber-border">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    <span className="text-[10px] font-heading text-white/60 uppercase tracking-widest">OEE</span>
                    <span className="ml-auto text-sm font-heading text-neon-cyan">{oeeTotal}%</span>
                </div>

                <div className="flex items-center gap-3">
                    <GaugeRing label="Avail." value={availability} color="#39ff14" />
                    <GaugeRing label="Perf." value={performance} color="#00fff5" />
                    <GaugeRing label="Quality" value={quality} color="#ff00ff" />
                </div>
            </div>
        </div>
    );
}
