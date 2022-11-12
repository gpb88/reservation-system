const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('database/controller');

const Role = sequelize.define(
    'Role',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            defaultValue: 'user',
            unique: true,
        },
    },
    {
        tableName: 'roles',
        timestamps: false,
    }
);

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.STRING(60),
            allowNull: false,
            defaultValue: 'user',
            references: {
                model: Role,
                key: 'name',
            },
        },
        password: {
            type: DataTypes.STRING(72),
            allowNull: true,
        },
        otp_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        external_type: {
            type: DataTypes.STRING(16),
            allowNull: true,
        },
        external_id: {
            type: DataTypes.STRING(64),
            allowNull: true,
            unique: true,
        },
    },
    {
        tableName: 'users',
        timestamps: false,
    }
);

const RefreshTokenHash = sequelize.define(
    'RefreshTokenHash',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        refresh_token_hash: {
            type: DataTypes.STRING(72),
            allowNull: false,
        },
    },
    {
        tableName: 'refresh_token_hashes',
        timestamps: false,
    }
);

const Machine = sequelize.define(
    'Machine',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        location: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: 'machines',
        timestamps: false,
    }
);

const Event = sequelize.define(
    'Event',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        machine_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Machine,
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        start_time: { type: DataTypes.DATE, allowNull: false },
        end_time: { type: DataTypes.DATE, allowNull: false },
    },
    {
        tableName: 'events',
        timestamps: false,
    }
);

const Setting = sequelize.define(
    'Setting',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: false,
            primaryKey: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        otp_secret: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        create_calendar: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'settings',
        timestamps: false,
    }
);

const Permission = sequelize.define(
    'Permission',
    {},
    {
        tableName: 'permissions',
        timestamps: false,
    }
);

User.belongsToMany(Machine, {
    through: Permission,
    foreignKey: 'user_id',
    targetKey: 'id',
});
Machine.belongsToMany(User, {
    through: Permission,
    foreignKey: 'machine_id',
    targetKey: 'id',
});

Role.hasMany(User, {
    foreignKey: 'role',
    targetKey: 'name',
});
User.belongsTo(Role, {
    foreignKey: 'role',
    targetKey: 'name',
});

User.hasOne(RefreshTokenHash, {
    foreignKey: 'id',
    targetKey: 'id',
});
RefreshTokenHash.belongsTo(User, {
    foreignKey: 'id',
    targetKey: 'id',
});

User.hasOne(Setting, {
    foreignKey: 'id',
    targetKey: 'id',
});
Setting.belongsTo(User, {
    foreignKey: 'id',
    targetKey: 'id',
});

Machine.hasMany(Event, {
    foreignKey: 'machine_id',
    targetKey: 'id',
});
Event.belongsTo(Machine, {
    foreignKey: 'machine_id',
    targetKey: 'id',
});

module.exports = {
    User,
    Role,
    Machine,
    Event,
    Permission,
    RefreshTokenHash,
    Setting,
};
