const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const {
    updateSetting,
    getSetting,
    updateUserOtp,
} = require('database/methods');

router.get('/secret/generate', function (req, res) {
    const { userID } = req.query;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    const secret = speakeasy.generateSecret({ name: 'AGH-RS' });
    updateSetting(userID, 'otp_secret', secret.base32)
        .then(() => {
            res.status(200).send({ secret: secret });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/secret/verify', async function (req, res) {
    const { userID, token } = req.body;

    if (!userID || !token) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const data = await getSetting(userID, 'otp_secret');

        const verified = speakeasy.totp.verify({
            secret: data.otp_secret,
            encoding: 'base32',
            token: token,
        });

        if (verified) updateUserOtp(userID, true);

        res.status(200).send({ verified: verified });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/disable', async function (req, res) {
    const { userID } = req.body;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        updateUserOtp(userID, false);
        updateSetting(userID, 'otp_secret', null);

        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
