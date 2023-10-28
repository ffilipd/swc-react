const db = require("../models");
const { Equipment, Type, Name } = db.equipment;
const Op = db.Sequelize.Op;

// Create and Save a new Equipment
exports.create = (req, res) => {

};

// Retrieve all Equipment from the database.
exports.findAll = async (req, res) => {
    try {
        const equipment = await Equipment.findAll();
        res.json(equipment);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error occurred while retrieving equipment.' });
    }
};

// Retrieve Equipment filters.
exports.findFilters = async (req, res) => {
    try {
        const { equipment_name, type } = req.query;

        if (!type) {
            const types = await Type.findAll({ attributes: ['name'] });
            return res.json(types.map(type => type.name));
        }

        if (!equipment_name) {
            const specificType = await Type.findOne({
                where: { name: type },
                include: {
                    model: Name,
                    attributes: ['name'],
                }
            });
            const names = specificType.equipment_names.map(data => data.name);
            return res.json(names);
            // return res.json(names.map(name => name.name));
        }

        const equipment = await Equipment.findAll({
            include: [{
                model: Name,
                where: { name: equipment_name },
                attributes: []
            }],
            attributes: ['number', 'id'],
            order: [['number', 'asc']]
        });

        res.json(equipment);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

// Find a single Equipment with an id
exports.findOne = (req, res) => {

};

// Update a Equipment by the id in the request
exports.update = (req, res) => {

};

// Delete a Equipment with the specified id in the request
exports.delete = (req, res) => {

};
