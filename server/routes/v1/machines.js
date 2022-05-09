const express = require('express');
const router = express.Router();
const { getMachines } = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const machines = await getMachines();

        res.status(200).send({ message: 'Success', machines: machines });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
