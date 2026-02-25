// ──────────────────────────────────────────────────
//  AdminSidebar — Machine list + Broadcast buttons
// ──────────────────────────────────────────────────

import React from 'react';
import useMachineStore from '../store/useMachineStore';
import StatusBadge from './StatusBadge';

const MACHINE_ICONS = {
    'solder-paste-printer': '🖨️',
    'spi': '🔬',
    'pick-and-place': '🤖',
    'reflow-oven': '🔥',
    'aoi': '📸',
};

export default function AdminSidebar() {
    const machines = useMachineStore((s) => s.machines);
    const activeMachineId = useMachineStore((s) => s.activeMachineId);
    const broadcastMachine = useMachineStore((s) => s.broadcastMachine);
    const isConnected = useMachineStore((s) => s.isConnected);

    return (
        <div className="w-80 h-full bg-cyber-surface border-r border-cyber-border flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-cyber-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/20 flex items-center justify-center">
                        <span className="text-neon-cyan text-sm">⚡</span>
                    </div>
                    <div>
                        <h2 className="font-heading text-sm tracking-wider text-white">ADMIN CONTROL</h2>
                        <p className="text-[10px] text-white/30">SMT Line Digital Twin</p>
                    </div>
                </div>

                {/* Connection status */}
                <div className="mt-3 flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-neon-green' : 'bg-neon-red'}`}
                        style={{
                            boxShadow: `0 0 6px ${isConnected ? '#39ff14' : '#ff3131'}`,
                        }}
                    />
                    <span className="text-[10px] text-white/40 font-mono uppercase">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>

            {/* Machine list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {machines.map((machine) => {
                    const isActive = machine.id === activeMachineId;
                    return (
                        <div
                            key={machine.id}
                            className={`group p-3 rounded-xl border transition-all duration-300 ${isActive
                                    ? 'bg-neon-cyan/5 border-neon-cyan/30 shadow-neon-cyan'
                                    : 'bg-cyber-card border-cyber-border hover:border-white/10 hover:bg-cyber-card/80'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">{MACHINE_ICONS[machine.type] || '⚙️'}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xs font-medium text-white truncate">{machine.name}</h3>
                                    <p className="text-[10px] text-white/30 mt-0.5 truncate">{machine.description}</p>
                                    <div className="mt-2">
                                        <StatusBadge status={machine.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Broadcast button */}
                            <button
                                onClick={() => broadcastMachine(machine.id)}
                                disabled={isActive}
                                className={`mt-3 w-full py-2 px-3 rounded-lg text-xs font-heading uppercase tracking-wider transition-all duration-300 ${isActive
                                        ? 'bg-neon-cyan/10 text-neon-cyan/50 border border-neon-cyan/20 cursor-default'
                                        : 'bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 text-white border border-white/10 hover:from-neon-cyan/20 hover:to-neon-magenta/20 hover:border-neon-cyan/30 hover:shadow-neon-cyan active:scale-[0.98]'
                                    }`}
                            >
                                {isActive ? '● Broadcasting' : '◉ Broadcast'}
                            </button>

                            {/* Mini OEE bar */}
                            <div className="mt-2 flex items-center gap-2 text-[9px] text-white/30">
                                <span>OEE:</span>
                                <div className="flex-1 h-1 bg-cyber-bg rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-magenta"
                                        style={{
                                            width: `${(machine.oee.availability * machine.oee.performance * machine.oee.quality) / 10000}%`,
                                        }}
                                    />
                                </div>
                                <span className="font-mono text-neon-cyan">
                                    {((machine.oee.availability * machine.oee.performance * machine.oee.quality) / 10000).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cyber-border">
                <div className="text-[10px] text-white/20 font-mono text-center">
                    SMT DIGITAL TWIN v1.0 — {machines.length} MACHINES ONLINE
                </div>
            </div>
        </div>
    );
}
