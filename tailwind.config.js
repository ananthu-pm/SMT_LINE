/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'cyber-bg': '#0a0a0f',
                'cyber-surface': '#12121a',
                'cyber-border': '#1e1e2e',
                'cyber-card': '#16161f',
                'neon-cyan': '#00fff5',
                'neon-magenta': '#ff00ff',
                'neon-yellow': '#f0e130',
                'neon-green': '#39ff14',
                'neon-red': '#ff3131',
                'neon-orange': '#ff6600',
                'status-run': '#39ff14',
                'status-idle': '#f0e130',
                'status-error': '#ff3131',
            },
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'neon-cyan': '0 0 15px rgba(0, 255, 245, 0.4), 0 0 30px rgba(0, 255, 245, 0.1)',
                'neon-magenta': '0 0 15px rgba(255, 0, 255, 0.4), 0 0 30px rgba(255, 0, 255, 0.1)',
                'neon-green': '0 0 15px rgba(57, 255, 20, 0.4)',
                'neon-red': '0 0 15px rgba(255, 49, 49, 0.4)',
                'neon-yellow': '0 0 15px rgba(240, 225, 48, 0.4)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
