const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipment", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        number: {
            type: Sequelize.STRING
        }
    });

    const Name = sequelize.define("equipment_name", {
        name: {
            type: Sequelize.STRING
        }
    })

    const Type = sequelize.define("equipment_type", {
        name: {
            type: Sequelize.STRING
        }
    });

    Equipment.belongsTo(Name);
    Equipment.belongsTo(Type);
    Name.belongsTo(Type);

    Name.hasMany(Equipment);
    Type.hasMany(Equipment);
    Type.hasMany(Name);

    return { Equipment, Type, Name };
};