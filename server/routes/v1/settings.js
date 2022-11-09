const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getSetting } = require('database/methods');

router.get('/', function (req, res) {
    const { userID } = req.query;

    getSettings(userID)
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

    updateSettings(userID, settings)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/single', function (req, res) {
    const { userID, key } = req.query;

    getSetting(userID, key)
        .then((response) => {
            res.status(200).send({ setting: response });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
