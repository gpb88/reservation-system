import { getUserByName, getToken } from 'API';
import { verifyPass } from 'services/password';

export async function handleLogin(userToCheck, rememberMe) {
    let authenticated = false;
    let userFromDB = await getUserByName(userToCheck.username)
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.error(err);
        });

    if (userFromDB) {
        authenticated = await verifyPass(
            userToCheck.password,
            userFromDB.u_password
        );
    }

    if (authenticated) {
        await getToken(userToCheck)
            .then((token) => {
                if (rememberMe) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', userToCheck.username);
                } else {
                    sessionStorage.setItem('token', token);
                    sessionStorage.setItem('user', userToCheck.username);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return authenticated;
}
