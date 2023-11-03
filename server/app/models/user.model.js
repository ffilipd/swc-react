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
        },
        role: {
            type: Sequelize.ENUM('admin', 'moderator', 'user'),
            defaultValue: 'user'
        },
        talkoo_points: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        first_point_given: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
        },
        latest_point_given: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW')
        },
        access: {
            type: Sequelize.STRING
        }
    });

    return User;
};