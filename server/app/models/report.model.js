const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("report", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        description: {
            type: Sequelize.STRING
        },
        damageType: {
            type: Sequelize.ENUM('major', 'minor', 'none', 'other')
        }
    });

    return Report;
};