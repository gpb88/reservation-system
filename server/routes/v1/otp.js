const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const {
    updateSetting,
    getSetting,
    updateUserOtp,
} = require('database/methods');

router.post('/generate-secret', function (req, res) {
    const { userID } = req.body;

    const secret = speakeasy.generateSecret({ name: 'AGH-RS' });
    updateSetting(userID, 'otp_secret', secret.base32);

    res.status(200).send({ secret: secret });
});

router.post('/verify-secret', async function (req, res) {
    const { userID, token } = req.body;

    const data = await getSetting(userID, 'otp_secret');

    const verified = speakeasy.totp.verify({
        secret: data.otp_secret,
        encoding: 'base32',
        token: token,
    });

    if (verified) updateUserOtp(userID, true);

    res.status(200).send({ verified: verified });
});

router.post('/disable', async function (req, res) {
    const { userID } = req.body;

    updateUserOtp(userID, false);
    updateSetting(userID, 'otp_secret', null);

    res.status(200).send();
});

module.exports = router;
