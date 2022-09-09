const express = require('express');
const router = express.Router();
const { validateToken, createToken } = require('services/token');

router.post('/', function (req, res) {
    const { token, userID } = req.body;

    validateToken(token, userID)
        .then((isValid) => {
            isValid ? res.status(200).send() : res.status(400).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/', function (req, res) {
    const { userID } = req.query;

    try {
        let token = createToken(userID);
        res.status(200).send({ token: token });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
