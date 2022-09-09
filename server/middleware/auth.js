const { validateToken } = require('services/token');

module.exports = (req, res, next) => {
    try {
        const url = req.baseUrl;
        const method = req.method;

        const isRequestingLogin =
            method === 'GET' &&
            (url.includes('/user') || url.includes('/token'));

        if (isRequestingLogin) {
            next();
        } else {
            const token = req.headers.authorization.split(' ')[1];
            const userID = req.headers.userid;

            let isValid = validateToken(token, userID);
            if (isValid) {
                next();
            } else res.status(400).send();
        }
    } catch {
        res.status(500).send();
    }
};
