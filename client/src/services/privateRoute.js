import { checkToken } from 'services/checkToken';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const PrivateRoute = () => {
    const [authed, setAuthed] = useState(null);

    useEffect(() => {
        (async function () {
            let isValid = await checkToken();
            setAuthed(isValid);
        })();
    }, []);

    if (authed === null) return null;
    return authed ? <Outlet /> : <Navigate to='/login' />;
};
