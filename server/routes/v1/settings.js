const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getSetting } = require('database/methods');

router.get('/', function (req, res) {
    const { userID } = req.query;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

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

    if (!userID || !settings) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

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

    if (!userID || !key) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    getSetting(userID, key)
        .then((response) => {
            if (response) res.status(200).send({ setting: response });
            else res.status(404).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
