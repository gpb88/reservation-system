const auth = require('middleware/auth');

const token = require('routes/v1/token');
const user = require('routes/v1/user');
const roles = require('routes/v1/roles');
const machine = require('routes/v1/machine');
const permissions = require('routes/v1/permissions');
const event = require('routes/v1/event');
const google = require('routes/v1/google');
const settings = require('routes/v1/settings');
const otp = require('routes/v1/otp');
const predict = require('routes/v1/predict');

const version = 'v1';

module.exports = function (app) {
    app.use(`/${version}/user`, auth, user);
    app.use(`/${version}/roles`, auth, roles);
    app.use(`/${version}/token`, auth, token);
    app.use(`/${version}/machine`, auth, machine);
    app.use(`/${version}/permissions`, auth, permissions);
    app.use(`/${version}/event`, auth, event);
    app.use(`/${version}/google`, auth, google);
    app.use(`/${version}/settings`, auth, settings);
    app.use(`/${version}/otp`, auth, otp);
    app.use(`/${version}/predict`, auth, predict);
};
