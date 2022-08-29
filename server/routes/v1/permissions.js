const express = require('express');
const router = express.Router();
const {
    getPermisions,
    addPermission,
    revokePermission,
} = require('services/dbController');

router.get('/', function (req, res) {
    const { userID } = req.query;

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
        let { permissions } = req.body;
        let promises = [];

        JSON.parse(permissions).forEach((permission) => {
            let promise = permission.hasPermission
                ? addPermission(userID, permission.machine_id)
                : revokePermission(userID, permission.machine_id);
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
