const express = require('express');
const router = express.Router();
const { getRoles } = require('services/dbController');

router.get('/', function (req, res) {
    getRoles()
        .then((roles) => {
            res.status(200).send({ roles: roles });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
