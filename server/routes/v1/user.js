const express = require('express');
const router = express.Router();
const {
    getUserByName,
    getUserByID,
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    addDefaultSettings,
    addExternalUser,
    getUserByExternalID,
} = require('database/methods');

router.get('/', async function (req, res) {
    try {
        const { userID, username } = req.query;

        if (!username && !userID) {
            console.log('No username or ID');
            return res.status(402).send();
        }

        let user = null;
        if (userID) user = await getUserByID(userID);
        else user = await getUserByName(username);

        if (user == false || user == null) {
            console.log('User not found');
            return res.status(404).send();
        }

        res.status(200).send({ user: user });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/external', async function (req, res) {
    try {
        const { externalID, externalType } = req.query;

        if (!externalID && !externalType) {
            console.log('No type or ID');
            return res.status(402).send();
        }

        const user = await getUserByExternalID(externalID, externalType);

        if (user == false || user == null) {
            console.log('User not found');
            return res.status(404).send();
        }

        res.status(200).send({ user: user });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/all', function (req, res) {
    getUsers()
        .then((users) => {
            res.status(200).send({ users: users });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.put('/', function (req, res) {
    const { userID, username, role } = req.body;

    if (!userID || !username || !role) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    updateUser(userID, username, role)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', async function (req, res) {
    const { username, role, password } = req.body;

    if (!username || !role || !password) {
        console.log('Incomplete data');
        return res.status(402).send();
    }
		
    try {
        const user = await getUserByName(username);

        if (user == false || user == null) {
            const newUser = await addUser(username, role, password);

            addDefaultSettings(newUser.id);

            res.status(200).send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/external', async function (req, res) {
    const { username, externalID, externalType } = req.body;

    if (!username || !externalID || !externalType) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const user = await getUserByExternalID(externalID, externalType);

        if (user == false || user == null) {
            const newUser = await addExternalUser(
                username,
                externalID,
                externalType
            );

            addDefaultSettings(newUser.id);

            res.status(200).send({ user: newUser });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.delete('/', async function (req, res) {
    const { userID } = req.body;

    if (!userID) {
        console.log('No user ID');
        return res.status(200).send();
    }

    deleteUser(userID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
