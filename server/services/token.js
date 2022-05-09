const jwt = require('jsonwebtoken');

function createToken(username, role) {
    const token = jwt.sign({ username, role }, process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), {
        algorithm: 'RS256',
        expiresIn: '2h',
    });

    return token;
}

function validateToken(token) {
    let isValid = null;

    try {
        isValid = jwt.verify(token, process.env.PUBLIC_KEY.replace(/\\n/g, '\n'));
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
