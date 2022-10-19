import axios from 'axios';
import { updateHeader } from 'interceptors/token';

const version = 'v1';
const baseUrl = 'http://127.0.0.1:8080/' + version;
updateHeader(axios);
// ? Accept cookies

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

export async function validateAccessToken(token, userID) {
    const result = await axios
        .post(baseUrl + '/token/validate/access', {
            token: token,
            userID: userID,
        })
        .then(function (response) {
            return response.data.isValid;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function validateRefreshToken() {
    const result = await axios
        .post(
            baseUrl + '/token/validate/refresh',
            {},
            {
                withCredentials: true,
            }
        )
        .then(function (response) {
            return response.data.isValid;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function createToken(userID) {
    const result = await axios
        .post(
            baseUrl + '/token/create',
            { userID: userID },
            {
                withCredentials: true,
            }
        )
        .then(function (response) {
            return response.data.accessToken;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function refreshToken(userID) {
    const result = await axios
        .post(baseUrl + '/token/refresh', { userID: userID })
        .then(function (response) {
            return response.data.accessToken;
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

export async function addClass(userID, machineID, title, startTime, endTime) {
    const result = await axios
        .post(baseUrl + '/class', {
            userID: userID,
            machineID: machineID,
            title: title,
            startTime: startTime,
            endTime: endTime,
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

export async function getGoogleAuthURL() {
    const result = await axios
        .get(baseUrl + '/google/authorize/url')
        .then(function (response) {
            return response.data.url;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getGoogleAuth() {
    const result = await axios
        .get(baseUrl + '/google/authorize/check')
        .then(function (response) {
            return response.data.isAuthorized;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function sendGoogleAuthCode(accessCode) {
    const result = await axios
        .post(baseUrl + '/google/authorize/code', {
            accessCode: accessCode,
        })
        .then(function (response) {
            return response.data;
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
            console.log(response);
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

export async function uploadToGoogleCalendar(summary, start, end) {
    const result = await axios
        .post(baseUrl + '/google/event', {
            summary: summary,
            start: start,
            end: end,
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
            console.log(response.data.colors);
            return response.data.colors;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getSettings(userID) {
    const result = await axios
        .get(baseUrl + '/settings', {
            params: { userID: userID },
        })
        .then(function (response) {
            return response.data.settings;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function saveSettings(userID, settings) {
    const result = await axios
        .post(baseUrl + '/settings', {
            userID: userID,
            settings: settings,
        })
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}
