const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipment", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        identifier: { // This is the equipment number
            type: Sequelize.STRING,
            unique: false
        },
        equipmentNameId: {
            type: DataTypes.UUID,
            references: {
                model: 'equipment_names', // Name of the table
                key: 'id',
            },
        },
    });

    const Name = sequelize.define("equipment_name", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        equipmentTypeId: {
            type: DataTypes.UUID,
            references: {
                model: 'equipment_types', // Name of the table
                key: 'id',
            },
        },
    });

    const Type = sequelize.define("equipment_type", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
    });

    // Define associations
    Equipment.belongsTo(Name, { foreignKey: 'equipmentNameId', as: 'equipment_name' });
    Name.belongsTo(Type, { foreignKey: 'equipmentTypeId', as: 'equipment_type' });

    Name.hasMany(Equipment, { foreignKey: 'equipmentNameId', as: 'equipment' });
    Type.hasMany(Name, { foreignKey: 'equipmentTypeId', as: 'equipment_names' });

    return { Equipment, Type, Name };
};