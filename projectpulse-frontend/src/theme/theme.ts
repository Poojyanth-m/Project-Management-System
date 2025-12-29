import { createTheme, type PaletteMode } from '@mui/material/styles';

// Custom theme to remove blue highlights and use grey instead
export const getTheme = (mode: PaletteMode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#6B7280', // Grey instead of blue
            light: '#9CA3AF',
            dark: '#4B5563',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#E65F2B', // Brand orange
            light: '#F7D2C2',
            dark: '#BF491F',
            contrastText: '#FFFFFF',
        },
        background: {
            default: mode === 'light' ? '#EBDFD7' : '#121212',
            paper: mode === 'light' ? '#F2EAE5' : '#1E1E1E',
        }
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                            borderColor: '#6B7280', // Grey border on focus instead of blue
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#6B7280', // Grey label on focus instead of blue
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                root: {
                    '&:after': {
                        borderBottomColor: '#6B7280', // Grey underline instead of blue
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6B7280', // Grey border on focus
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#6B7280', // Grey checkbox instead of blue
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    '&.Mui-checked': {
                        color: '#6B7280', // Grey radio button instead of blue
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: '#6B7280', // Grey switch instead of blue
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#6B7280',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:focus-visible': {
                        outline: 'none',
                    },
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*:focus': {
                    outline: 'none !important',
                },
                '*:focus-visible': {
                    outline: 'none !important',
                },
            },
        },
    },
});
