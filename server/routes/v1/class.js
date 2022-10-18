const express = require('express');
const router = express.Router();
const {
    getClasses,
    addClass,
    deleteClass,
} = require('database/methods');

router.get('/all', function (req, res) {
    getClasses()
        .then((classes) => {
            res.status(200).send({ classes: classes });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', function (req, res) {
    let { userID, machineID, title, startTime, endTime } = req.body;

    addClass(userID, machineID, title, startTime, endTime)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.delete('/', function (req, res) {
    const { classID } = req.body;

    if (!classID) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    deleteClass(classID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
