import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.css';
import App from 'App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import { theme } from 'common/theme';
import { ThemeProvider } from '@mui/material';

ReactDOM.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <App></App>
                </ThemeProvider>
            </BrowserRouter>
        </SnackbarProvider>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
