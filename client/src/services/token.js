import { validateToken } from 'API';

export async function checkToken() {
    // ? Check if user is already logged in (has valid token)
    // ? if so, redirect to home
    let isValid = false;
    let jwtToken = getToken();

    console.log(jwtToken);

    if (jwtToken) {
        await validateToken(jwtToken)
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
