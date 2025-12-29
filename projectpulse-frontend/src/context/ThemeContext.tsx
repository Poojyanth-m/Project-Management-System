import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, type PaletteMode, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';

interface ThemeContextType {
    mode: PaletteMode | 'system';
    setMode: (mode: PaletteMode | 'system') => void;
    actualMode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    setMode: () => { },
    actualMode: 'light',
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<PaletteMode | 'system'>('light');
    const [actualMode, setActualMode] = useState<PaletteMode>('light');

    // Load saved preference
    useEffect(() => {
        const savedMode = localStorage.getItem('themeMode') as PaletteMode | 'system';
        if (savedMode) {
            setMode(savedMode);
        }
    }, []);

    // Update actual mode based on system or selection
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (mode === 'system') {
                setActualMode(mediaQuery.matches ? 'dark' : 'light');
            } else {
                setActualMode(mode);
            }
        };

        handleChange(); // Initial check

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    // Save preference
    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = getTheme(actualMode);

    return (
        <ThemeContext.Provider value={{ mode, setMode, actualMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
