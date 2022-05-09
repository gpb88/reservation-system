const express = require('express');
const router = express.Router();
const { validateToken, createToken } = require('services/token');

router.post('/', async function (req, res) {
    try {
        const { token } = req.body;
        const isValid = validateToken(token);
        if (isValid) return res.status(200).send({ message: 'Success' });

        res.status(400).send({ message: 'Token is not valid' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.get('/', async function (req, res) {
    try {
        const { username, role } = req.query;

        // * Create JWT token
        const token = createToken(username, role);
        res.status(200).send({ message: 'Success', token: token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
