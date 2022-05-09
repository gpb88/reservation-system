const express = require('express');
const router = express.Router();
const { getRoles } = require('services/dbController');
const { validateToken } = require('services/token');

router.get('/', async function (req, res) {
    try {
        const roles = await getRoles();
        res.status(200).send({ message: 'Success', roles: roles });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
