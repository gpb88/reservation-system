const express = require('express');
const router = express.Router();
const {
    getPermisions,
    addPermission,
    revokePermission,
} = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const { userID } = req.query;

        const permissions = await getPermisions(userID);

        res.status(200).send({ message: 'Success', permissions: permissions });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', function (req, res) {
    try {
        const { userID } = req.body;
        let { permissions } = req.body;
        let promises = [];

        JSON.parse(permissions).forEach((permission) => {
            let promise = permission.hasPermission
                ? addPermission(userID, permission.machine_id)
                : revokePermission(userID, permission.machine_id);
            promises.push(promise);
        });

        Promise.all(promises)
            .then(() =>
                res.status(200).send({ message: 'Permissions updated' })
            )
            .catch((error) => {
                console.log(error);
                res.status(400).send({ message: 'Something went wrong' });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
