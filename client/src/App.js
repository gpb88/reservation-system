import * as React from 'react';
import Login from 'routes/Login';
import Home from 'routes/Home';
import { Routes, Route } from 'react-router-dom';

export default function App() {
    const [rememberMe, setRememberMe] = React.useState(false);

    return (
        <Routes>
            <Route
                exact
                path='/'
                element={
                    <Login
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                    />
                }
            />
            <Route
                exact
                path='/home'
                element={<Home rememberMe={rememberMe} />}
            />
        </Routes>
    );
}
