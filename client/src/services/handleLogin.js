import { getUserByName } from 'API';
import { verifyPass } from 'services/password';
import { issueNewToken } from 'services/token';

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

    if (authenticated) await issueNewToken(userData.id, rememberMe);

    return authenticated;
}
