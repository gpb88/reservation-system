const token = require('routes/v1/token');
const user = require('routes/v1/user');
const users = require('routes/v1/users');
const roles = require('routes/v1/roles');
const machines = require('routes/v1/machines');
const permissions = require('routes/v1/permissions');

const version = 'v1';

module.exports = function (app) {
    app.use(`/${version}/user`, user);
    app.use(`/${version}/users`, users);
    app.use(`/${version}/roles`, roles);
    app.use(`/${version}/token`, token);
    app.use(`/${version}/machines`, machines);
    app.use(`/${version}/permissions`, permissions);
};
