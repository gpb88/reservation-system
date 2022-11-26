const { validateAccessToken } = require('services/token');

module.exports = async (req, res, next) => {
    try {
        const url = req.originalUrl;
        const method = req.method;

        const isRequestingLogin =
            (method === 'GET' && url.includes('/user')) ||
            (method === 'POST' && url.includes('/user/external')) ||
            (method === 'POST' && url.includes('/token')) ||
            (method === 'POST' && url.includes('/otp/secret/verify'));

        if (isRequestingLogin) {
            next();
        } else {
            const token = req.headers.authorization.split(' ')[1];
            const userID = req.headers.userid;

            let isValid = await validateAccessToken(token, userID);

            if (isValid) {
                next();
            } else res.status(401).send();
        }
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
};
