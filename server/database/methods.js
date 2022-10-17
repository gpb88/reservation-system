const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('database/controller');
const { User, Role } = require('database/models');

async function createDefaults() {
    // ? Create default roles
    const roles = await Role.findAll();

    if (roles.length === 0) {
        await Role.bulkCreate([
            { role_id: 1, name: 'user' },
            { role_id: 2, name: 'admin' },
        ]);
    }

    // ? Create default users
    const users = await User.findAll();

    if (users.length === 0) {
        await User.create({
            username: 'admin',
            password:
                '$2a$12$q9g.oOA9NiirdGMCi4X6QOg2aWhDKn9hvZSMgr5kbRRSALyomUmme',
            role: 'admin',
        });
    }
}
async function syncDB() {
    await sequelize.sync({ force: true });

    createDefaults();
}

async function getUserByName(username) {
    const user = await User.findOne({
        where: {
            username: username,
        }
    });

    console.log(user);

    return user;
}

async function getUserByID(ID) {
    const user = await User.findOne({
        where: {
            id: ID,
        }
    });

    console.log(user);

    return user;
}

async function getRoles() {
    const roles = await Role.findAll();

    return roles;
}

async function getMachines() {
    const machines = await Machine.findAll({});

    return machines;
}

async function getMachineByID(ID) {
    const machine = await Machine.findOne({
        where: {
            id: ID,
        },
    });

    return machine;
}

async function getMachineByName(name) {
    const machine = await Machine.findOne({
        where: {
            name: name,
        },
    });

    return machine;
}

async function addMachine(name, description) {
    const machine = await Machine.create({
        name: name,
        description: description,
    });

    return machine;
}

async function updateMachine(ID, name, description) {
    const machine = await Machine.update(
        {
            name: name,
            description: description,
        },
        {
            where: {
                id: ID,
            },
        }
    );

    return machine;
}

async function deleteMachine(ID) {
    const machine = await Machine.destroy({
        where: {
            id: ID,
        },
    });

    return machine;
}

async function getUsers() {
    const query = {
        text: `
			SELECT users.user_id, users.username, roles.role_id, roles.role, users.u_password 
			FROM users 
			INNER JOIN roles 
				ON users.u_role=roles.role_id 
			ORDER BY users.user_id ASC`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function getPermisions(userID) {
    const query = {
        text: `
			SELECT machines.machine_id, machines.machine_name 
			FROM machines
			INNER JOIN permissions
				ON machines.machine_id = permissions.machine_id
			INNER JOIN users
				ON users.user_id = permissions.user_id
			WHERE users.user_id=${userID}`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function addUser(username, role, password) {
    const query = {
        text: `
			INSERT INTO users
				(username, u_role, u_password)
			VALUES 
				('${username}', '${role}', '${password}')`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function updateUser(userID, username, role) {
    const query = {
        text: `
			UPDATE users
			SET username='${username}',
					u_role='${role}'
			WHERE user_id='${userID}'`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function deleteUser(userID) {
    const query = {
        text: `
			DELETE FROM users
			WHERE user_id='${userID}'`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function addPermission(userID, machineID) {
    const query = {
        text: `
			INSERT INTO permissions 
				(user_id, machine_id)
			VALUES 
				('${userID}', '${machineID}')
			ON CONFLICT (user_id, machine_id) DO UPDATE 
				SET 
					user_id=${userID}, 
					machine_id=${machineID}`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function revokePermission(userID, machineID) {
    const query = {
        text: `
			DELETE FROM permissions
			WHERE user_id=${userID} AND machine_id=${machineID}`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function getClasses() {
    const query = {
        text: `
			SELECT * 
			FROM classes`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function getClassesForUser(userID) {
    const query = {
        text: `
			SELECT * 
			FROM classes
			where user_id=${userID}`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function addClass(userID, title, startTime, endTime, machineID) {
    const query = {
        text: `
			INSERT INTO classes 
				(user_id, title, start_time, end_time, machine_id)
			VALUES 
				('${userID}', '${title}', '${startTime}', '${endTime}', '${machineID}')`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function deleteClass(classID) {
    const query = {
        text: `
		DELETE FROM classes
		WHERE class_id='${classID}'`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            console.log(e.stack);
            throw e.stack;
        });

    return result;
}

async function addDefaultSettings(userID, defaultSettings) {
    let result;

    for (const [key, value] of Object.entries(defaultSettings)) {
        console.log(key, value, userID);
        const query = {
            text: `
				INSERT INTO user_settings
					(user_id, key, value)
				VALUES
					('${userID}', '${key}', '${value}')`,
        };

        result = await client
            .query(query)
            .then((res) => {
                return res;
            })
            .catch((e) => {
                console.log(e.stack);
                throw e.stack;
            });
    }

    return result;
}

async function getSettingsForUser(userID) {
    const query = {
        text: `
		SELECT key, value
		FROM user_settings
		WHERE user_id='${userID}'`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function getSetting(userID, key) {
    const query = {
        text: `
		SELECT value
		FROM user_settings
		WHERE key='${key}' AND user_id='${userID}'`,
    };

    let result = await client
        .query(query)
        .then((res) => {
            return res.rows[0].value;
        })
        .catch((e) => {
            console.error(e.stack);
            throw e.stack;
        });

    return result;
}

async function saveSettings(userID, settings) {
    let result;

    for (const [key, value] of Object.entries(settings)) {
        const query = {
            text: `
				UPDATE user_settings
				SET value='${value}'
				WHERE key='${key}' AND user_id='${userID}'`,
        };

        result = await client
            .query(query)
            .then((res) => {
                return res.rows;
            })
            .catch((e) => {
                console.error(e.stack);
                throw e.stack;
            });
    }

    return result;
}

module.exports = {
    syncDB,
    getUserByName,
    getUserByID,
    updateUser,
    getRoles,
    getMachines,
    updateMachine,
    getMachineByName,
    getMachineByID,
    getClassesForUser,
    addMachine,
    deleteMachine,
    getUsers,
    getPermisions,
    addUser,
    addPermission,
    revokePermission,
    deleteUser,
    getClasses,
    addClass,
    deleteClass,
    addDefaultSettings,
    getSettingsForUser,
    getSetting,
    saveSettings,
};
