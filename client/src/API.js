import axios from 'axios';
import { updateHeader } from 'interceptors/token';

const version = 'v1';
const baseUrl = 'http://127.0.0.1:8080/' + version;
updateHeader(axios);

export async function getUserByName(username) {
    const result = await axios
        .get(baseUrl + '/user', { params: { username: username } })
        .then(function (response) {
            return response.data.user;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getUserByID(userID) {
    const result = await axios
        .get(baseUrl + '/user', { params: { userID: userID } })
        .then(function (response) {
            return response.data.user;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function validateToken(token) {
    const result = await axios
        .post(baseUrl + '/token', {
            token: token,
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getToken(user) {
    const result = await axios
        .get(baseUrl + '/token', {
            params: { username: user.username, role: user.role },
        })
        .then(function (response) {
            return response.data.token;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getRoles() {
    const result = await axios
        .get(baseUrl + '/roles')
        .then(function (response) {
            return response.data.roles;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function addMachine(name, description) {
    const result = await axios
        .post(baseUrl + '/machine', {
            name: name,
            description: description,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function updateMachine(machineID, name, description) {
    const result = await axios
        .put(baseUrl + '/machine', {
            machineID: machineID,
            name: name,
            description: description,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getMachines() {
    const result = await axios
        .get(baseUrl + '/machine/all')
        .then(function (response) {
            return response.data.machines;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getMachine(machineID) {
    const result = await axios
        .get(baseUrl + '/machine', { params: { machineID: machineID } })
        .then(function (response) {
            return response.data.machine;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function deleteMachine(machineID) {
    const result = await axios
        .delete(baseUrl + '/machine', { data: { machineID: machineID } })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getUsers() {
    const result = await axios
        .get(baseUrl + '/user/all')
        .then(function (response) {
            return response.data.users;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getPermissions(userID) {
    const result = await axios
        .get(baseUrl + '/permissions', { params: { userID: userID } })
        .then(function (response) {
            return response.data.permissions;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function addUser(username, role, password) {
    const result = await axios
        .post(baseUrl + '/user', {
            username: username,
            role: role,
            password: password,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function updateUser(userID, username, role) {
    const result = await axios
        .put(baseUrl + '/user', {
            userID: userID,
            username: username,
            role: role,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function deleteUser(userID) {
    const result = await axios
        .delete(baseUrl + '/user', {
            data: { userID: userID },
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function setPermissions(userID, permissions) {
    const result = await axios
        .post(baseUrl + '/permissions', {
            userID: userID,
            permissions: JSON.stringify(permissions),
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getClasses() {
    const result = await axios
        .get(baseUrl + '/class/all')
        .then(function (response) {
            return response.data.classes;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function addClass(userID, title, startTime, endTime, machineID) {
    const result = await axios
        .post(baseUrl + '/class', {
            userID: userID,
            title: title,
            startTime: startTime,
            endTime: endTime,
            machineID: machineID,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function deleteClass(classID) {
    const result = await axios
        .delete(baseUrl + '/class', { data: { classID: classID } })
        .then(function (response) {
            return response.data.class;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getCalendars() {
	const result = await axios
			.get(baseUrl + '/google/calendar')
			.then(function (response) {
					console.log(response)
					return response.data.calendars;
			})
			.catch(function (error) {
					console.error(error);
			});

	return result;
}

export async function createCalendar() {
    const result = await axios
        .post(baseUrl + '/google/calendar')
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function uploadToGoogleCalendar(events) {
    const result = await axios
        .post(baseUrl + '/google/event/batch', {
            events: events,
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getCalendarColors() {
    const result = await axios
        .get(baseUrl + '/google/calendar/colors')
        .then(function (response) {
            return response.data.colors;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getEventColors() {
    const result = await axios
        .get(baseUrl + '/google/event/colors')
        .then(function (response) {
            return response.data.colors;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}
