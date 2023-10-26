const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        language: {
            type: Sequelize.STRING,
            defaultValue: 'en'
        },
        last_login: {
            type: Sequelize.DATE
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        rejected: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        password: {
            type: Sequelize.STRING
        }
    });

    const Role = sequelize.define("role", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    User.belongsTo(Role);
    Role.hasMany(User);

    return { User, Role };
};