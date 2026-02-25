// ──────────────────────────────────────────────────
//  App.jsx — Router: /admin → Admin, / → User
// ──────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminView from './views/AdminView';
import UserView from './views/UserView';

function LandingPage() {
    return (
        <div className="h-screen w-screen bg-cyber-bg flex items-center justify-center">
            <div className="text-center space-y-8 animate-fade-in">
                {/* Logo / Title */}
                <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/20 flex items-center justify-center shadow-neon-cyan">
                        <span className="text-3xl">⚡</span>
                    </div>
                    <h1 className="font-heading text-3xl tracking-widest text-white">
                        SMT <span className="text-neon-cyan">DIGITAL TWIN</span>
                    </h1>
                    <p className="text-sm text-white/40 max-w-md mx-auto">
                        Real-time 3D monitoring and synchronized control for your Surface Mount Technology production line.
                    </p>
                </div>

                {/* Role selection */}
                <div className="flex items-center gap-4 justify-center">
                    <Link
                        to="/admin"
                        className="group relative px-8 py-4 rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 hover:bg-neon-magenta/10 transition-all duration-300 hover:shadow-neon-magenta"
                    >
                        <div className="text-neon-magenta font-heading text-sm tracking-wider uppercase">🛡️ Admin</div>
                        <div className="text-[10px] text-white/30 mt-1">Control & Broadcast</div>
                    </Link>

                    <Link
                        to="/user"
                        className="group relative px-8 py-4 rounded-xl border border-neon-cyan/30 bg-neon-cyan/5 hover:bg-neon-cyan/10 transition-all duration-300 hover:shadow-neon-cyan"
                    >
                        <div className="text-neon-cyan font-heading text-sm tracking-wider uppercase">👁 User</div>
                        <div className="text-[10px] text-white/30 mt-1">Follow & Observe</div>
                    </Link>
                </div>

                {/* Info */}
                <div className="text-[10px] text-white/20 font-mono space-y-1">
                    <p>Socket.io Server: localhost:4000</p>
                    <p>5 Machines • Real-Time Sync • 3D Viewport</p>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin" element={<AdminView />} />
                <Route path="/user" element={<UserView />} />
            </Routes>
        </BrowserRouter>
    );
}
