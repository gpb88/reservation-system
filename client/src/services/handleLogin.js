import { getUser, getToken } from 'API';
import { verifyPass } from 'services/password';

export async function handleLogin(user) {
    let isLogged = false;
    let db_user = await getUser(user.username);
    console.log(db_user);

    let isPassValid = verifyPass(user.password, db_user.u_password);
    if (isPassValid) {
        await getToken(user).then((response) => {
            localStorage.setItem('token', JSON.stringify(response.data.token));
            isLogged = true;
        });
    }

    return isLogged;
}
