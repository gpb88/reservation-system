const express = require('express');
const router = express.Router();
const { getClasses, addClass } = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const classes = await getClasses();

        res.status(200).send({ message: 'Success', classes: classes });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        let { userID, title, startTime, endTime } = req.body;
        console.log(userID, title, startTime, endTime);
        try {
            await addClass(userID, title, startTime, endTime);
            return res.status(200).send({ message: 'Class added' });
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
