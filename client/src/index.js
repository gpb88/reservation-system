import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.css';
import App from 'App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
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

ReactDOM.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <BrowserRouter>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
                <ThemeProvider theme={theme}>
                    <App></App>
                </ThemeProvider>
            </SnackbarProvider>
        </BrowserRouter>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
