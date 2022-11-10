const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { updateRefreshToken, getRefreshToken } = require('database/methods');

function createAccessToken(userID) {
    const key = process.env.ACCESS_PRIVATE_KEY.replace(/\\n/g, '\n');

    const accessToken = jwt.sign({ userID }, key, {
        algorithm: 'RS256',
        expiresIn: '30m',
    });

    return accessToken;
}

function createRefreshToken(userID) {
    const key = process.env.REFRESH_PRIVATE_KEY.replace(/\\n/g, '\n');

    const refreshToken = jwt.sign({ userID }, key, {
        algorithm: 'RS256',
        expiresIn: '7d',
    });

    writeRefreshTokenToDB(userID, refreshToken);

    return refreshToken;
}

async function validateAccessToken(accessToken, userID) {
    let isValid = false;
    const key = process.env.ACCESS_PUBLIC_KEY.replace(/\\n/g, '\n');

    try {
        const tokenData = jwt.verify(accessToken, key);

        if (Number(tokenData.userID) == Number(userID)) isValid = true;
    } catch (error) {
        // ? Token expired error
        console.log('Access token expired or malformed');
    }

    return isValid;
}

async function validateRefreshToken(refreshToken) {
    let isValid = false;
    const key = process.env.REFRESH_PUBLIC_KEY.replace(/\\n/g, '\n');

    try {
        const tokenData = jwt.verify(refreshToken, key);
        // ? Compare token with one hashed in DB

        const hashedRefreshToken = await getRefreshToken(tokenData.userID);

        isValid = await bcrypt.compare(
            refreshToken,
            hashedRefreshToken.dataValues.refresh_token_hash
        );
    } catch (error) {
        // ? Token expired error
        console.log('Refresh token expired or malformed');
    }

    return isValid;
}

async function getUserIDFromToken(accessToken) {
    let userID = null;
    const key = process.env.ACCESS_PUBLIC_KEY.replace(/\\n/g, '\n');

    try {
        const tokenData = jwt.verify(accessToken, key);

        userID = tokenData.userID;
    } catch (error) {
        // ? Token expired error
        console.log(error);
    }

    return userID;
}

function writeRefreshTokenToDB(userID, refreshToken) {
    bcrypt
        .hash(refreshToken, 12)
        .then(function (hash) {
            console.log(hash);
            updateRefreshToken(userID, hash);
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    validateAccessToken,
    validateRefreshToken,
    getUserIDFromToken,
};
