const express = require('express');
const router = express.Router();
const { validateToken, createToken } = require('services/token');

router.post('/', function (req, res) {
    const { token } = req.body;

    validateToken(token)
        .then((isValid) => {
            console.log(isValid);
            isValid ? res.status(200).send() : res.status(400).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/', function (req, res) {
    const { username, role } = req.query;

    try {
        let token = createToken(username, role);
        res.status(200).send({ token: token });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
