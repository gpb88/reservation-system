const express = require('express');
const router = express.Router();
const {
    getUserByName,
    getUserByID,
    getUsers,
    addUser,
    deleteUser,
    updateUser,
} = require('services/dbController');

router.get('/', async function (req, res) {
    try {
        const { userID, username } = req.query;

        // * Validate user input
        if (!username && !userID) {
            console.log('No username or ID');
            return res.status(200).send({ message: 'No username' });
        }

        let user = null;
        if (userID) user = await getUserByID(userID);
        else user = await getUserByName(username);

        // * User not found
        if (user == false || user == null) {
            console.log('User not found');
            return res.status(200).send({ message: 'User not found' });
        }

        return res.status(200).send({ message: 'Success', user: user });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

router.get('/all', async function (req, res) {
    try {
        const users = await getUsers();

        res.status(200).send({ message: 'Success', users: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.put('/', async function (req, res) {
    try {
        const { userID, username, role } = req.body;

        // * Validate user input
        if (!username || !role) {
            console.log('Incomplete data');
            return res.status(400).send({ message: 'Incomplete data' });
        }

        try {
            await updateUser(userID, username, role);
            return res.status(200).send({ message: 'User updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Unknown error occured' });
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

        const user = await getUserByName(username);

        // * User not found => can be added
        if (user == false || user == null) {
            try {
                await addUser(username, role, password);
                return res.status(200).send({ message: 'User added' });
            } catch (error) {
                console.log(error);
                return res
                    .status(500)
                    .send({ message: 'Something went wrong' });
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
        const { userID } = req.body;

        // * Validate user input
        if (!userID) {
            console.log('No user ID');
            return res.status(200).send({ message: 'No user ID' });
        }

        await deleteUser(userID);

        return res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
