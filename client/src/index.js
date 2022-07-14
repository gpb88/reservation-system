import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/index.css';
import App from 'App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

console.log(process.env.REACT_APP_CLIENT_ID)
ReactDOM.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <BrowserRouter>
            <App></App>
        </BrowserRouter>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);
