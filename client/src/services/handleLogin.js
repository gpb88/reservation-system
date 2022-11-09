import { getUserByName } from 'API';
import { verifyPass } from 'services/password';
import { issueNewToken } from 'services/token';

export async function verifyCredentials(userToCheck) {
    let authenticated = false;

    const userData = await getUserByName(userToCheck.username);

    if (userData) {
        authenticated = await verifyPass(
            userToCheck.password,
            userData.password
        ).catch((err) => {
            console.error(err);
        });
    }

    console.log(userData);
    if (authenticated) {
        return userData;
    } else return authenticated;
}

export async function generateTokens(userID, rememberMe) {
    await issueNewToken(userID, rememberMe);
}
