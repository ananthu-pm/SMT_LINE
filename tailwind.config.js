/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark theme palette
                'dt-bg': '#0c0c14',
                'dt-surface': '#13131f',
                'dt-border': '#1f1f32',
                'dt-card': '#181828',
                'dt-text': '#e2e8f0',
                'dt-muted': '#94a3b8',
                // Light theme palette
                'lt-bg': '#f8f9fc',
                'lt-surface': '#ffffff',
                'lt-border': '#e2e5ea',
                'lt-card': '#f1f3f7',
                'lt-text': '#1e293b',
                'lt-muted': '#64748b',
                // Accent colors (shared)
                'accent-blue': '#3b82f6',
                'accent-cyan': '#06b6d4',
                'accent-indigo': '#6366f1',
                'accent-green': '#22c55e',
                'accent-red': '#ef4444',
                'accent-amber': '#f59e0b',
                'accent-purple': '#a855f7',
                'accent-orange': '#f97316',
                // Neons for dark mode
                'neon-cyan': '#00fff5',
                'neon-blue': '#00b4ff',
                'neon-green': '#39ff14',
                'neon-red': '#ff3131',
            },
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
                'neon-blue': '0 0 20px rgba(0,180,255,0.35), 0 0 40px rgba(0,180,255,0.08)',
                'neon-cyan': '0 0 15px rgba(0,255,245,0.35)',
                'card-light': '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
                'card-dark': '0 2px 8px rgba(0,0,0,0.4)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
                'fade-in': 'fadeIn 0.5s ease-out',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
        },
    },
    plugins: [],
};
