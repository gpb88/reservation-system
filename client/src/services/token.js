import { validateToken } from 'API';
import { getUserID } from 'services/handleLogin';

export async function checkToken() {
    let isValid = false;
    const jwtToken = getToken();
    const userID = getUserID();

    if (jwtToken && userID) {
        await validateToken(jwtToken, userID)
            .then((response) => {
                if (response.status === 200) isValid = true;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return isValid;
}

export function getToken() {
    let jwtToken = localStorage.getItem('token');
    if (jwtToken == null) jwtToken = sessionStorage.getItem('token');

    return jwtToken;
}

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}
