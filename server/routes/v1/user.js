const express = require('express');
const router = express.Router();
const { getUser, addUser, deleteUser } = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const { username } = req.query;

        // * Validate user input
        if (!username) {
            console.log('No username');
            return res.status(200).send({ message: 'No username' });
        }

        const user = await getUser(username);

        // * User not found
        if (user == false) {
            console.log('User not found');
            return res.status(200).send({ message: 'User not found' });
        }

        return res.status(200).send({ message: 'Success', user: user });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        const { username, role, password } = req.body;

        // * Validate user input
        if (!username || !role || !password) {
            console.log('Incomplete data');
            return res.status(200).send({ message: 'Incomplete data' });
        }

        const user = await getUser(username);

        // * User not found => can be added
        if (user == false) {
            try {
                await addUser(username, role, password);
                return res.status(200).send({ message: 'User added' });
            } catch (error) {
                console.log(error);
                return res.status(200).send({ message: 'Something went wrong' });
            }
        }

        return res.status(200).send({ message: 'User exists' });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

router.delete('/', async function (req, res) {
    try {
        const { username } = req.body;

        // * Validate user input
        if (!username) {
            console.log('No username');
            return res.status(200).send({ message: 'No username' });
        }

        await deleteUser(username);

        return res.status(200).send({ message: 'Success'});
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
