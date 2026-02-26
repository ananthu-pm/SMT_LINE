// ──────────────────────────────────────────────────
//  App.jsx — Router with Landing, Admin, and User
// ──────────────────────────────────────────────────

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminView from './views/AdminView';
import UserView from './views/UserView';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function LandingPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen w-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-dt-bg' : 'bg-lt-bg'}`}>
            <div className="text-center space-y-8 animate-fade-in">
                {/* Theme toggle */}
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>

                {/* Logo / Title */}
                <div className="space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${isDark
                        ? 'bg-gradient-to-br from-neon-blue/20 to-accent-indigo/20 border border-neon-blue/20'
                        : 'bg-gradient-to-br from-accent-blue/10 to-accent-indigo/10 border border-accent-blue/20'
                        }`}>
                        <span className="text-4xl">⚡</span>
                    </div>
                    <h1 className={`font-heading text-3xl tracking-widest ${isDark ? 'text-white' : 'text-lt-text'}`}>
                        SMT <span className={isDark ? 'text-neon-blue' : 'text-accent-blue'}>DIGITAL TWIN</span>
                    </h1>
                    <p className={`text-sm max-w-lg mx-auto ${isDark ? 'text-white/40' : 'text-lt-muted'}`}>
                        Real-time 3D monitoring and synchronized control for your Surface Mount Technology production line.
                    </p>
                </div>

                {/* Role selection */}
                <div className="flex items-center gap-5 justify-center">
                    <Link
                        to="/admin"
                        className={`group relative px-10 py-5 rounded-2xl border transition-all duration-300 ${isDark
                            ? 'border-accent-purple/30 bg-accent-purple/5 hover:bg-accent-purple/10 hover:shadow-lg hover:shadow-accent-purple/20'
                            : 'border-accent-indigo/20 bg-accent-indigo/5 hover:bg-accent-indigo/10 hover:shadow-md'
                            }`}
                    >
                        <div className={`font-heading text-sm tracking-wider uppercase ${isDark ? 'text-accent-purple' : 'text-accent-indigo'}`}>🛡️ Admin</div>
                        <div className={`text-xs mt-2 ${isDark ? 'text-white/30' : 'text-lt-muted'}`}>Master Control</div>
                    </Link>

                    <Link
                        to="/user"
                        className={`group relative px-10 py-5 rounded-2xl border transition-all duration-300 ${isDark
                            ? 'border-neon-blue/30 bg-neon-blue/5 hover:bg-neon-blue/10 hover:shadow-lg hover:shadow-neon-blue/20'
                            : 'border-accent-blue/20 bg-accent-blue/5 hover:bg-accent-blue/10 hover:shadow-md'
                            }`}
                    >
                        <div className={`font-heading text-sm tracking-wider uppercase ${isDark ? 'text-neon-blue' : 'text-accent-blue'}`}>👁 User</div>
                        <div className={`text-xs mt-2 ${isDark ? 'text-white/30' : 'text-lt-muted'}`}>Follower View</div>
                    </Link>
                </div>

                {/* Info */}
                <div className={`text-xs font-mono space-y-1 ${isDark ? 'text-white/15' : 'text-lt-muted/40'}`}>
                    <p>15 Stations • Real-Time Sync • 3D Viewport</p>
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
