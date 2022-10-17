const express = require('express');
const router = express.Router();
const { getSettingsForUser, saveSettings } = require('database/methods');

router.get('/', function (req, res) {
    const { userID } = req.query;

    getSettingsForUser(userID)
        .then((settings) => {
            res.status(200).send({ settings: settings });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', function (req, res) {
    const { userID, settings } = req.body;

    saveSettings(userID, settings)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
