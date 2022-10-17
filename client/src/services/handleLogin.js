import { getUserByName, getToken } from 'API';
import { verifyPass } from 'services/password';

export async function handleLogin(userToCheck, rememberMe) {
    let authenticated = false;
    let userData = await getUserByName(userToCheck.username).catch((err) => {
        console.error(err);
    });

    if (userData) {
        authenticated = await verifyPass(
            userToCheck.password,
            userData.password
        ).catch((err) => {
            console.error(err);
        });
    }

    if (authenticated) {
        await getToken(userData)
            .then((token) => {
                if (rememberMe) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('userID', userData.id);
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('userID', userData.id);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return authenticated;
}

export function getUserID() {
    let userID = localStorage.getItem('userID');
    if (userID == null) userID = sessionStorage.getItem('userID');

    return userID;
}
