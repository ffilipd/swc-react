const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        uuid: {
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
        role: {
            type: Sequelize.STRING,
            defaultValue: 'viewer'
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        rejected: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};