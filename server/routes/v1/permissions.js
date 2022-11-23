const express = require('express');
const router = express.Router();
const {
    getPermisions,
    addPermission,
    revokePermission,
} = require('database/methods');

router.get('/', function (req, res) {
    const { userID } = req.query;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    getPermisions(userID)
        .then((permissions) => {
            res.status(200).send({ permissions: permissions });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', function (req, res) {
    try {
        const { userID } = req.body;
        let { machines } = req.body;
        let promises = [];

        if (!userID || !machines) {
            console.log('Incomplete data');
            return res.status(402).send();
        }

        JSON.parse(machines).forEach((machine) => {
            let promise = machine.hasPermission
                ? addPermission(userID, machine.id)
                : revokePermission(userID, machine.id);
            promises.push(promise);
        });

        Promise.all(promises)
            .then(() => res.status(200).send())
            .catch((error) => {
                console.log(error);
                res.status(500).send();
            });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
