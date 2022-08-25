const express = require('express');
const router = express.Router();
const {
    getMachines,
    getMachine,
    addMachine,
    deleteMachine,
} = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const { machineID } = req.query;

        const machine = await getMachine(machineID);

        // * Machine not found
        if (machine == false || machine == null) {
            console.log('Machine not found');
            return res.status(200).send({ message: 'Machine not found' });
        }

        res.status(200).send({ message: 'Success', machine: machine });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.get('/all', async function (req, res) {
    try {
        const machines = await getMachines();

        res.status(200).send({ message: 'Success', machines: machines });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        const { name, description } = req.body;

        // * Validate user input
        if (!name) {
            console.log('Incomplete data');
            return res.status(200).send({ message: 'Incomplete data' });
        }

        const machine = await getMachine(name);

        // * User not found => can be added
        if (machine == false) {
            try {
                await addMachine(name, description);
                return res.status(200).send({ message: 'Machine added' });
            } catch (error) {
                console.log(error);
                return res
                    .status(200)
                    .send({ message: 'Something went wrong' });
            }
        }

        return res.status(200).send({ message: 'Machine exists' });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

router.delete('/', async function (req, res) {
    try {
        const { name } = req.body;

        // * Validate user input
        if (!name) {
            console.log('Incomplete data');
            return res.status(200).send({ message: 'Incomplete data' });
        }

        await deleteMachine(name);

        return res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
