// ──────────────────────────────────────────────────
//  ThemeToggle — Sun/Moon toggle button
// ──────────────────────────────────────────────────

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark
                ? 'bg-dt-surface border border-dt-border hover:border-neon-blue/30 text-neon-blue'
                : 'bg-lt-surface border border-lt-border hover:border-accent-blue/30 text-accent-blue shadow-sm'
                }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
            <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-lg"
            >
                {isDark ? '☀️' : '🌙'}
            </motion.span>
        </motion.button>
    );
}
