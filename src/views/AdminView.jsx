// ──────────────────────────────────────────────────
//  AdminView — Dashboard with sidebar + preview
// ──────────────────────────────────────────────────

import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Viewport3D from '../components/Viewport3D';
import InfoOverlay from '../components/InfoOverlay';
import OEEWidget from '../components/OEEWidget';

export default function AdminView() {
    return (
        <div className="h-screen w-screen flex bg-cyber-bg overflow-hidden">
            {/* Left sidebar */}
            <AdminSidebar />

            {/* Right — 3D viewport + overlays */}
            <div className="flex-1 relative">
                <Viewport3D />
                <InfoOverlay />
                <OEEWidget />

                {/* Admin badge */}
                <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neon-magenta/10 border border-neon-magenta/30 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse-glow" style={{ boxShadow: '0 0 8px #ff00ff' }} />
                        <span className="text-[10px] font-heading text-neon-magenta uppercase tracking-widest">Admin Mode</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
