import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Appearance = Theme | 'system';

interface ThemeContextType {
    theme: Theme;
    appearance: Appearance;
    toggleTheme: () => void;
    setAppearance: (appearance: Appearance) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDark = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getResolvedTheme = (appearance: Appearance): Theme => {
    if (appearance === 'system') {
        return prefersDark() ? 'dark' : 'light';
    }
    return appearance;
};

const applyTheme = (theme: Theme) => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [appearance, setAppearanceState] = useState<Appearance>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedAppearance = (typeof localStorage !== 'undefined' ? localStorage.getItem('appearance') : null) as Appearance | null;
        const initialAppearance = savedAppearance || 'system';
        setAppearanceState(initialAppearance);

        const resolvedTheme = getResolvedTheme(initialAppearance);
        applyTheme(resolvedTheme);
        setMounted(true);
    }, []);

    // Handle system theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (appearance === 'system') {
                const newTheme = prefersDark() ? 'dark' : 'light';
                applyTheme(newTheme);
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [appearance]);

    const theme = getResolvedTheme(appearance);

    const setAppearance = (newAppearance: Appearance) => {
        setAppearanceState(newAppearance);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('appearance', newAppearance);
        }
        const resolvedTheme = getResolvedTheme(newAppearance);
        applyTheme(resolvedTheme);
    };

    const toggleTheme = () => {
        const newTheme: Appearance = appearance === 'light' ? 'dark' : 'light';
        setAppearance(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, appearance, toggleTheme, setAppearance }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
