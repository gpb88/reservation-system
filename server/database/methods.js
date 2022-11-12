const { Sequelize, DataTypes, Op } = require('sequelize');
const { sequelize } = require('database/controller');
const {
    User,
    Role,
    Machine,
    Event,
    Permission,
    RefreshTokenHash,
    Setting,
} = require('database/models');
const { defaultSettings } = require('services/defaultSettings');

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
        await User.bulkCreate([
            {
                username: 'admin',
                password:
                    '$2a$12$q9g.oOA9NiirdGMCi4X6QOg2aWhDKn9hvZSMgr5kbRRSALyomUmme',
                role: 'admin',
                otp_enabled: false,
            },
            {
                username: 'user',
                password:
                    '$2a$12$TaC88Ae0NEVdLx/t9PFMX.Xhti6.9aTJFgamUBiTsZPV7gLRAy2iq',
                role: 'user',
                otp_enabled: false,
            },
        ]);
    }

    // ? Create default users
    const settings = await Setting.findAll();

    if (settings.length === 0) {
        await Setting.bulkCreate([
            {
                id: 1,
                create_calendar: false,
            },
            {
                id: 2,
                create_calendar: false,
            },
        ]);
    }

    // ? Create default machines
    const machines = await Machine.findAll();

    if (machines.length === 0) {
        await Machine.bulkCreate([
            {
                name: 'Machine 1',
            },
            {
                name: 'Machine 2',
            },
            {
                name: 'Machine 3',
            },
            {
                name: 'Machine 4',
            },
            {
                name: 'Machine 5',
            },
        ]);
    }

    // ? Create default permissions
    const permissions = await Permission.findAll();

    if (permissions.length === 0) {
        await Permission.bulkCreate([
            {
                user_id: 1,
                machine_id: 1,
            },
            {
                user_id: 1,
                machine_id: 2,
            },
            {
                user_id: 1,
                machine_id: 3,
            },
            {
                user_id: 2,
                machine_id: 4,
            },
            {
                user_id: 2,
                machine_id: 5,
            },
        ]);
    }
}
async function syncDB() {
    await sequelize.sync();

    createDefaults();
}

async function getUserByName(username) {
    const user = await User.findOne({
        where: {
            username: username,
        },
    });

    return user;
}

async function getUserByID(ID) {
    const user = await User.findOne({
        where: {
            id: ID,
        },
    });

    return user;
}

async function getUserByExternalID(externalID, externalType) {
    const user = await User.findOne({
        where: {
            external_id: externalID,
            external_type: externalType,
        },
    });

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

async function addMachine(name, description, location) {
    const machine = await Machine.create({
        name: name,
        description: description,
        location: location,
    });

    return machine;
}

async function updateMachine(ID, name, description, location) {
    const machine = await Machine.update(
        {
            name: name,
            description: description,
            location: location,
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
    const users = await User.findAll();

    return users;
}

async function getPermisions(userID) {
    const permissions = await Machine.findAll({
        include: {
            model: User,
            where: {
                id: userID,
            },
        },
    });

    return permissions;
}

async function addUser(username, role, password) {
    const user = await User.create({
        username: username,
        role: role,
        password: password,
    });

    return user;
}

async function addExternalUser(username, externalID, externalType) {
    const user = await User.create({
        username: username,
        external_id: externalID,
        external_type: externalType,
    });

    return user;
}

async function updateUser(ID, username, role) {
    const user = await User.update(
        {
            username: username,
            role: role,
        },
        {
            where: {
                id: ID,
            },
        }
    );

    return user;
}

async function updateUserOtp(userID, otp_enabled) {
    const user = await User.update(
        {
            otp_enabled: otp_enabled,
        },
        {
            where: {
                id: userID,
            },
        }
    );

    return user;
}

async function updateRefreshToken(userID, refreshTokenHash) {
    const user = await RefreshTokenHash.upsert({
        id: userID,
        refresh_token_hash: refreshTokenHash,
    });

    return user;
}

async function getRefreshToken(userID) {
    const refreshToken = await RefreshTokenHash.findOne({
        where: {
            id: userID,
        },
        attributes: ['refresh_token_hash'],
    });

    return refreshToken;
}

async function deleteUser(ID) {
    const user = await User.destroy({
        where: {
            id: ID,
        },
    });

    return user;
}

async function addPermission(userID, machineID) {
    const permission = await Permission.upsert({
        user_id: userID,
        machine_id: machineID,
    });

    return permission;
}

async function revokePermission(userID, machineID) {
    const permission = await Permission.destroy({
        where: {
            user_id: userID,
            machine_id: machineID,
        },
    });

    return permission;
}

async function getEvents() {
    const events = await Event.findAll();

    return events;
}

async function getEventsForUser(userID) {
    const events = await Event.findAll({
        where: {
            user_id: userID,
        },
    });

    return events;
}

async function getEventsForUserWithLimit(userID, limit) {
    const events = await Event.findAll({
        include: {
            model: Machine,
        },
        where: {
            user_id: userID,
        },
        limit: limit,
        order: [['start_time', 'DESC']],
    });

    return events.reverse();
}

async function addEvent(userID, machineID, title, startTime, endTime) {
    const newEvent = await Event.create({
        user_id: userID,
        machine_id: machineID,
        title: title,
        start_time: startTime,
        end_time: endTime,
    });

    return newEvent;
}
async function getEventsInDateRange(startTime, endTime, machineID) {
    const events = await Event.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        {
                            start_time: {
                                [Op.gt]: new Date(startTime),
                                [Op.lt]: new Date(endTime),
                            },
                        },
                        {
                            end_time: {
                                [Op.gt]: new Date(startTime),
                                [Op.lt]: new Date(endTime),
                            },
                        },
                    ],
                },
                { machine_id: machineID },
            ],
        },
    });

    return events;
}

async function deleteEvent(ID) {
    const deletedEvent = await Event.destroy({
        where: {
            id: ID,
        },
    });

    return deletedEvent;
}

async function addDefaultSettings(userID) {
    const setting = await Setting.create({
        id: userID,
        otp: defaultSettings.otp,
        create_calendar: defaultSettings.create_calendar,
    });

    return setting;
}

async function getSettings(userID) {
    const settings = await Setting.findOne({
        where: {
            id: userID,
        },
    });

    return settings;
}

async function getSetting(userID, key) {
    const setting = await Setting.findOne({
        where: {
            id: userID,
        },
        attributes: [key],
    });

    return setting;
}

async function updateSettings(userID, newSettings) {
    const settings = await Setting.update(
        {
            otp: newSettings.otp,
            create_calendar: newSettings.create_calendar,
        },
        {
            where: {
                id: userID,
            },
        }
    );

    return settings;
}

async function updateSetting(userID, key, value) {
    const settings = await Setting.update(
        {
            [key]: value,
        },
        {
            where: {
                id: userID,
            },
        }
    );

    return settings;
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
    getEventsForUser,
    addMachine,
    deleteMachine,
    getUsers,
    getPermisions,
    addUser,
    addPermission,
    revokePermission,
    deleteUser,
    getEvents,
    addEvent,
    deleteEvent,
    addDefaultSettings,
    getSettings,
    getSetting,
    updateSettings,
    updateSetting,
    updateRefreshToken,
    getRefreshToken,
    updateUserOtp,
    addExternalUser,
    getUserByExternalID,
    getEventsForUserWithLimit,
    getEventsInDateRange,
};
