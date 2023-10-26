const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipment", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING
        },
        equipment_name: {
            type: Sequelize.STRING
        },
        number: {
            type: Sequelize.STRING
        }
    });

    return Equipment;
};