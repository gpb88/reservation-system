const auth = require('middleware/auth');

const token = require('routes/v1/token');
const user = require('routes/v1/user');
const roles = require('routes/v1/roles');
const machine = require('routes/v1/machine');
const permissions = require('routes/v1/permissions');
const _class = require('routes/v1/class');
const google = require('routes/v1/google');

const version = 'v1';

module.exports = function (app) {
    app.use(`/${version}/user`, auth, user);
    app.use(`/${version}/roles`, auth, roles);
    app.use(`/${version}/token`, auth, token);
    app.use(`/${version}/machine`, auth, machine);
    app.use(`/${version}/permissions`, auth, permissions);
    app.use(`/${version}/class`, auth, _class);
    app.use(`/${version}/google`, auth, google);
};
