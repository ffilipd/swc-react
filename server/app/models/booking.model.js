const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define("booking", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: {
            type: Sequelize.STRING
        },
        time_from: {
            type: Sequelize.STRING
        },
        time_to: {
            type: Sequelize.STRING
        }
    });

    return Booking;
};