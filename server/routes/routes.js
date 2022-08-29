const token = require('routes/v1/token');
const user = require('routes/v1/user');
const roles = require('routes/v1/roles');
const machine = require('routes/v1/machine');
const permissions = require('routes/v1/permissions');
const _class = require('routes/v1/class');
const google = require('routes/v1/google');

const version = 'v1';

module.exports = function (app) {
    app.use(`/${version}/user`, user);
    app.use(`/${version}/roles`, roles);
    app.use(`/${version}/token`, token);
    app.use(`/${version}/machine`, machine);
    app.use(`/${version}/permissions`, permissions);
    app.use(`/${version}/class`, _class);
    app.use(`/${version}/google`, google);
};
