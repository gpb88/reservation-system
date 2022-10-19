import {
    validateAccessToken,
    refreshToken,
    validateRefreshToken,
    createToken,
} from 'API';

export function getToken() {
    let accessToken = sessionStorage.getItem('accessToken');
    if (accessToken === undefined)
        accessToken = localStorage.getItem('accessToken');

    return accessToken;
}

export function getUserID() {
    let userID = sessionStorage.getItem('userID');
    if (userID === undefined) userID = localStorage.getItem('userID');

    return userID;
}

export async function issueNewToken(userID, rememberMe) {
    await createToken(userID)
        .then((accessToken) => {
            setToken(rememberMe, accessToken, userID);
        })
        .catch((err) => {
            console.error(err);
        });
}

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}

export function setToken(rememberMe, accessToken, userID) {
    if (rememberMe) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userID', userID);
    } else {
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('userID', userID);
    }
}

export async function checkToken(rememberMe) {
    let logOut = false;
    const accessToken = getToken();
    const userID = getUserID();

    if (accessToken) {
        const isAccessTokenValid = await validateAccessToken(
            accessToken,
            userID
        );

        if (isAccessTokenValid == false) {
            const isRefreshTokenValid = await validateRefreshToken();

            if (isRefreshTokenValid) {
                refresh(rememberMe, userID);
            } else logOut = true;
        }
    } else {
        logOut = true;
    }

    return logOut;
}

async function refresh(rememberMe, userID) {
    refreshToken(userID).then((accessToken) => {
        setToken(rememberMe, accessToken, userID);
    });
}
