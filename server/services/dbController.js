const { Client } = require('pg');

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGPASSWORD,
    password: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

function initDbConn() {
    return client.connect();
}

async function getUserByName(username) {
    const query = {
        text: `
				SELECT users.user_id, users.username, roles.role_id, roles.role, users.u_password 
				FROM users 
				INNER JOIN roles 
					ON users.u_role=roles.role_id
				WHERE username='${username}' 
				LIMIT 1`,
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

    result.length ? (result = result[0]) : (result = false);

    return result;
}

async function getUserByID(userID) {
    const query = {
        text: `
				SELECT users.user_id, users.username, roles.role_id, roles.role, users.u_password 
				FROM users 
				INNER JOIN roles 
					ON users.u_role=roles.role_id
				WHERE user_id='${userID}' 
				LIMIT 1`,
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

    result.length ? (result = result[0]) : (result = false);

    return result;
}

async function getRoles() {
    const query = {
        text: `
				SELECT role_id, role 
				FROM roles`,
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

async function getMachines() {
    const query = {
        text: `
				SELECT * 
				FROM machines`,
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

async function getMachineByID(machineID) {
    const query = {
        text: `
				SELECT machine_id, machine_name, description
				FROM machines
				WHERE machine_id='${machineID}'
				LIMIT 1`,
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

    result.length ? (result = result[0]) : (result = false);

    return result;
}

async function getMachineByName(machineName) {
    const query = {
        text: `
				SELECT machine_id, machine_name, description
				FROM machines
				WHERE machine_name='${machineName}'
				LIMIT 1`,
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

    result.length ? (result = result[0]) : (result = false);

    return result;
}

async function addMachine(name, description) {
    const query = {
        text: `
				INSERT INTO machines
					(machine_name, description)
				VALUES
					('${name}', '${description}')`,
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

async function updateMachine(machineID, name, description) {
    const query = {
        text: `
				UPDATE machines
				SET machine_name='${name}',
						description='${description}'
				WHERE machine_id='${machineID}'`,
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

async function deleteMachine(machineID) {
    const query = {
        text: `
				DELETE FROM machines
				WHERE machine_id='${machineID}'`,
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

module.exports = {
    client,
    initDbConn,
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
};
