import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f44336',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: 'Verdana',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    '&:hover': {
                        backgroundColor: '#1565c0',
                        cursor: 'pointer',
                    },
                },
            },
        },
    },
});
