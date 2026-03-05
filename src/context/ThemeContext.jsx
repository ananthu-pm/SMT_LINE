// ──────────────────────────────────────────────────
//  ThemeContext — Global Light/Dark Mode
// ──────────────────────────────────────────────────

import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const theme = 'light';

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add('light');
    }, []);

    const toggleTheme = () => { }; // No-op — dark mode removed

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
