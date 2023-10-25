module.exports = (sequelize, Sequelize) => {
    const Equipment = sequelize.define("equipment", {
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