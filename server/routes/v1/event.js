const express = require('express');
const router = express.Router();
const { getEvents, addEvent, deleteEvent } = require('database/methods');

router.get('/all', function (req, res) {
    getEvents()
        .then((response) => {
            res.status(200).send({ events: response });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', function (req, res) {
    let { userID, machineID, title, startTime, endTime } = req.body;

    addEvent(userID, machineID, title, startTime, endTime)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.delete('/', function (req, res) {
    const { eventID } = req.body;

    if (!eventID) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    deleteEvent(eventID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
