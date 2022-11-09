const express = require('express');
const router = express.Router();
const {
    getMachines,
    getMachineByName,
    getMachineByID,
    addMachine,
    deleteMachine,
    updateMachine,
} = require('database/methods');

router.get('/', function (req, res) {
    const { machineID } = req.query;

    getMachineByID(machineID)
        .then((machine) => {
            res.status(200).send({ machine: machine });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/all', function (req, res) {
    getMachines()
        .then((machines) => {
            res.status(200).send({ machines: machines });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.put('/', function (req, res) {
    const { machineID, name, description, location } = req.body;

    if (!machineID || !name) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    updateMachine(machineID, name, description, location)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', async function (req, res) {
    const { name, description, location } = req.body;

    if (!name) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    const machine = await getMachineByName(name);

    // * User not found => can be added
    if (machine == false || machine == null)
        addMachine(name, description, location)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
});

router.delete('/', function (req, res) {
    const { machineID } = req.body;

    if (!machineID) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    deleteMachine(machineID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
