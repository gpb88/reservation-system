const express = require('express');
const router = express.Router();
const { getEvents } = require('database/methods');

router.post('/time', function (req, res) {
    const { userID } = req.body;

    res.status(200).send({});
});

router.post('/machine', async function (req, res) {
    const { userID } = req.body;

    res.status(200).send({});
});

module.exports = router;
