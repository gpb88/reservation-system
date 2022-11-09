const express = require('express');
const router = express.Router();
const {
    validateAccessToken,
    validateRefreshToken,
    createAccessToken,
    createRefreshToken,
    getUserIdFromToken,
} = require('services/token');

router.post('/refresh', async function (req, res) {
    const { userID } = req.body;
    let refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const isValid = await validateRefreshToken(refreshToken);
        if (isValid == false) {
            return res.status(200).send({ isValid: isValid });
        }
    } else {
        console.log('No refresh token provided');
        return res.status(200).send({ isValid: false });
    }

    const accessToken = await createAccessToken(userID);
    refreshToken = await createRefreshToken(userID);

    // ? If user wants to refresh, rotate both tokens, send them to user and save to DB
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
    res.status(200).send({ isValid: true, accessToken: accessToken });
});

router.post('/validate/access', async function (req, res) {
    const { token, userID } = req.body;

    validateAccessToken(token, userID)
        .then((isValid) => {
            res.status(200).send({ isValid: isValid });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/create', async function (req, res) {
    const { userID } = req.body;

    try {
        const accessToken = await createAccessToken(userID);
        const refreshToken = await createRefreshToken(userID);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.status(200).send({ accessToken: accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
