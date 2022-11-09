const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('database/controller');
const {
    User,
    Role,
    Machine,
    Class,
    Permission,
    RefreshTokenHash,
    Settings,
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
    const settings = await Settings.findAll();

    if (settings.length === 0) {
        await Settings.bulkCreate([
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
                name: 'fsdfdsfds',
            },
            {
                name: 'gaadsadsad',
            },
            {
                name: 'fsdfdsgdafgdafds',
            },
            {
                name: 'gdfsg',
            },
            {
                name: 'ssgdf',
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

async function getUserByExternalId(externalId, externalType) {
    const user = await User.findOne({
        where: {
            external_id: externalId,
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

async function addExternalUser(username, externalId, externalType) {
    const user = await User.create({
        username: username,
        external_id: externalId,
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
    const user = await RefreshTokenHash.findOne(
        {
            attributes: ['refresh_token_hash'],
        },
        {
            where: {
                id: userID,
            },
        }
    );

    return user;
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

async function getClasses() {
    const classes = await Class.findAll();

    return classes;
}

async function getClassesForUser(userID) {
    const classes = await Class.findAll({
        where: {
            user_id: userID,
        },
    });

    return classes;
}

async function addClass(userID, machineID, title, startTime, endTime) {
    const newClass = await Class.create({
        user_id: userID,
        machine_id: machineID,
        title: title,
        start_time: startTime,
        end_time: endTime,
    });

    return newClass;
}

async function deleteClass(ID) {
    const deletedClass = await Class.destroy({
        where: {
            id: ID,
        },
    });

    return deletedClass;
}

async function addDefaultSettings(userID) {
    const settings = await Settings.create({
        id: userID,
        otp: defaultSettings.otp,
        create_calendar: defaultSettings.create_calendar,
    });

    return settings;
}

async function getSettings(userID) {
    const settings = await Settings.findOne({
        where: {
            id: userID,
        },
    });

    return settings;
}

async function getSetting(userID, key) {
    const setting = await Settings.findOne({
        attributes: [key],
        where: {
            id: userID,
        },
    });

    return setting;
}

async function updateSettings(userID, newSettings) {
    const settings = await Settings.update(
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
    const settings = await Settings.update(
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
    getSettings,
    getSetting,
    updateSettings,
    updateSetting,
    updateRefreshToken,
    getRefreshToken,
    updateUserOtp,
    addExternalUser,
    getUserByExternalId,
};
