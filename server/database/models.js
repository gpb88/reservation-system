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
            type: DataTypes.STRING(70),
            allowNull: false,
        },
    },
    {
        tableName: 'users',
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

const Class = sequelize.define(
    'Class',
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
        tableName: 'classes',
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

Role.hasOne(User, {
    foreignKey: 'role',
    targetKey: 'name',
});
User.belongsTo(Role, {
    foreignKey: 'role',
    targetKey: 'name',
});

module.exports = {
    User,
    Role,
    Machine,
    Class,
    Permission,
};
