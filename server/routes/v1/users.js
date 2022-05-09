const express = require('express');
const router = express.Router();
const { getUsers } = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const users = await getUsers();

        res.status(200).send({ message: 'Success', users: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
