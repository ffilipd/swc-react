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
        }
    });

    const Damage_Type = sequelize.define("damage_type", {
        name: {
            type: Sequelize.STRING
        }
    })

    Report.belongsTo(Damage_Type);
    Damage_Type.hasMany(Report);

    return { Report, Damage_Type };
};