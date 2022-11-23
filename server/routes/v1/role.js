const express = require('express');
const router = express.Router();
const { getRoles } = require('database/methods');

router.get('/all', function (req, res) {
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
