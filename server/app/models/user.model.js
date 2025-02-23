// User model

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.CHAR(36),
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        language: {
            type: Sequelize.STRING,
            defaultValue: 'en',
        },
        last_login: {
            type: Sequelize.DATE,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        rejected: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        role: {
            type: Sequelize.ENUM('admin', 'moderator', 'user'),
            defaultValue: 'user',
        },
        talkoo_points: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        first_point_given: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        latest_point_given: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        access: {
            type: Sequelize.STRING,
        },
    });

    return User;
};