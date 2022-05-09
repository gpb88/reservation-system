import { validateToken } from 'API';

export async function checkToken() {
    // ? Check if user is already logged in (has valid token)
    // ? if so, redirect to home
    let isValid = false;
    let jwtToken = localStorage.getItem('token');
    if (jwtToken && jwtToken !== 'undefined') {
        await validateToken(JSON.parse(jwtToken))
            .then((response) => {
                if (response.status === 200) isValid = true;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return isValid;
}
