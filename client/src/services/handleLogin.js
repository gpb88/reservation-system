import { getUser, getToken } from 'API';
import { verifyPass } from 'services/password';

export async function handleLogin(user) {
    let isUserValid = false;
    let db_user = '';
    try {
        db_user = await getUser(user.username);
    } catch {
        // handle error
    }

    console.log(user);
    if (db_user != undefined) {
        let isPassValid = await verifyPass(user.password, db_user.u_password);

        if (isPassValid) {
            await getToken(user).then((response) => {
                localStorage.setItem(
                    'token',
                    JSON.stringify(response.data.token)
                );
                isUserValid = true;
            });
        }
    }

    return isUserValid;
}

export function deleteToken() {
    localStorage.removeItem('token');
}
