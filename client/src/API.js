import axios from 'axios';
import { updateHeader } from 'interceptors/token';

const version = 'v1';
const baseUrl = 'http://bileg:8080/' + version;
updateHeader(axios);

export async function getUser(username) {
    const result = await axios
        .get(baseUrl + '/user', { params: { username: username } })
        .then(function (response) {
            console.log(response.config.url, response);
            return response.data.user;
        })
        .catch(function (error) {
            console.error(error);
            return error.response;
        });

    return result;
}

export async function validateToken(token) {
    const result = await axios
        .post(baseUrl + '/token', {
            token: token,
        })
        .then(function (response) {
            console.log(response.config.url, response);
            return response;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getToken(user) {
    const result = await axios
        .get(baseUrl + '/token', { params: { username: user.username, role: user.role } })
        .then(function (response) {
            console.log(response.config.url, response);
            return response;
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
            console.log(response.config.url, response);
            return response.data.roles;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getMachines() {
    const result = await axios
        .get(baseUrl + '/machines')
        .then(function (response) {
            console.log(response.config.url, response);
            return response.data.machines;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function getUsers() {
    const result = await axios
        .get(baseUrl + '/users')
        .then(function (response) {
            console.log(response.config.url, response);
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
            console.log(response.config.url, response);
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
            console.log(response.config.url, response);
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function deleteUser(username) {
    const result = await axios
        .delete(baseUrl + '/user', {
            data: { username: username },
        })
        .then(function (response) {
            console.log(response.config.url, response);
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}

export async function updatePermissions(userID, permissions) {
    const result = await axios
        .post(baseUrl + '/permissions', {
            userID: userID,
            permissions: JSON.stringify(permissions),
        })
        .then(function (response) {
            console.log(response.config.url, response);
            return response.data;
        })
        .catch(function (error) {
            console.error(error);
        });

    return result;
}
