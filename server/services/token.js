const jwt = require('jsonwebtoken');

function createToken(userID) {
    const token = jwt.sign(
        { userID },
        process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        {
            algorithm: 'RS256',
            expiresIn: '1h',
        }
    );

    return token;
}

async function validateToken(token, userID) {
    let isValid = false;

    try {
        const tokenData = jwt.verify(
            token,
            process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
        );

        if (Number(userID) === Number(tokenData.userID)) isValid = true;
    } catch (error) {
        // ? Token expired error
        console.log(error);
        isValid = false;
    }

    return isValid;
}

module.exports = {
    createToken,
    validateToken,
};
