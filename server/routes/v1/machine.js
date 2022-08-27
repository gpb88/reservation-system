const express = require('express');
const router = express.Router();
const {
    getMachines,
    getMachineByName,
    getMachineByID,
    addMachine,
    deleteMachine,
    updateMachine,
} = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const { machineID } = req.query;

        const machine = await getMachineByID(machineID);

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

router.put('/', async function (req, res) {
    try {
        const { machineID, name, description } = req.body;

        // * Validate user input
        if (!machineID || !name) {
            console.log('Incomplete data');
            return res.status(400).send({ message: 'Incomplete data' });
        }

        try {
            await updateMachine(machineID, name, description);
            return res.status(200).send({ message: 'Machine updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        const { name, description } = req.body;

        // * Validate user input
        if (!name) {
            console.log('Incomplete data');
            return res.status(400).send({ message: 'Incomplete data' });
        }

        const machine = await getMachineByName(name);

        // * User not found => can be added
        if (machine == false || machine == null) {
            try {
                await addMachine(name, description);
                return res.status(200).send({ message: 'Machine added' });
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
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
        const { machineID } = req.body;

        // * Validate user input
        if (!machineID) {
            console.log('Incomplete data');
            return res.status(200).send({ message: 'Incomplete data' });
        }

        try {
            await deleteMachine(machineID);
            return res.status(200).send({ message: 'Machine added' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
