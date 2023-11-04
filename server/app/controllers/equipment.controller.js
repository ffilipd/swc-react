const db = require("../models");
const { Equipment, Type, Name } = db.equipment;
const User = db.user;
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

// Retrieve Equipment Tree from the database.
exports.findEquipmentTree = async (req, res) => {
    try {
        const equipmentTree = await Type.findAll({
            include: [
                {
                    model: Name,
                    include: [
                        {
                            model: Equipment,
                            attributes: ['number']
                        }
                    ],
                    attributes: ['name']
                }
            ],
            attributes: ['name']
        });

        const formattedEquipmentTree = equipmentTree.map(type => {
            const typeName = type.name;
            const names = type.equipment_names.map(name => {
                const nameString = name.name;
                const numbers = name.equipment.map(equipment => equipment.number).sort();
                return { name: nameString, numbers };
            });
            return { typeName, names };
        });

        res.send(formattedEquipmentTree);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching equipment tree' });
    }
};

// Retrieve Equipment filters.
exports.findFilters = async (req, res) => {
    try {
        const { equipmentNameId, type } = req.query;

        if (!type) {
            const types = await Type.findAll({ attributes: ['name'] });
            return res.json(types.map(type => type.name));
        }

        if (!equipmentNameId) {
            const specificType = await Type.findOne({
                where: { name: type },
                include: {
                    model: Name,
                    attributes: ['name', 'id'],
                }
            });
            const names = specificType.equipment_names.map(data => {
                return {
                    name: data.name,
                    id: data.id
                }
            });
            return res.json(names);
            // return res.json(names.map(name => name.name));
        }

        const equipment = await Equipment.findAll({
            include: [{
                model: Name,
                where: { id: equipmentNameId },
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
