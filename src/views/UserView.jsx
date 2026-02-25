// ──────────────────────────────────────────────────
//  UserView — Full-screen follower viewport
// ──────────────────────────────────────────────────

import React from 'react';
import Viewport3D from '../components/Viewport3D';
import InfoOverlay from '../components/InfoOverlay';
import OEEWidget from '../components/OEEWidget';
import useMachineStore from '../store/useMachineStore';

export default function UserView() {
    const isConnected = useMachineStore((s) => s.isConnected);
    const activeMachine = useMachineStore((s) => s.getActiveMachine());

    return (
        <div className="h-screen w-screen relative bg-cyber-bg overflow-hidden">
            {/* Full-screen 3D viewport */}
            <Viewport3D />

            {/* Machine info overlay (bottom-right) */}
            <InfoOverlay />

            {/* OEE widget (top-right) */}
            <OEEWidget />

            {/* Machine name header */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="bg-cyber-surface/60 backdrop-blur-xl border border-cyber-border rounded-full px-6 py-2 shadow-glass animate-fade-in">
                    <h1 className="font-heading text-sm text-white tracking-widest uppercase text-center">
                        {activeMachine.name}
                    </h1>
                </div>
            </div>

            {/* Connection status */}
            <div className="absolute bottom-4 left-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-surface/50 backdrop-blur border border-cyber-border rounded-full">
                    <div
                        className={`w-2 h-2 rounded-full animate-pulse-glow ${isConnected ? 'bg-neon-green' : 'bg-neon-red'}`}
                        style={{ boxShadow: `0 0 6px ${isConnected ? '#39ff14' : '#ff3131'}` }}
                    />
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                        {isConnected ? 'Synced' : 'Reconnecting...'}
                    </span>
                </div>
            </div>

            {/* Follower mode indicator */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded-full animate-fade-in">
                    <span className="text-[10px] font-heading text-neon-cyan/60 uppercase tracking-widest">👁 Follower Mode</span>
                </div>
            </div>
        </div>
    );
}
