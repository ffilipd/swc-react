const db = require("../models");
const { Equipment, Type, Name } = db.equipment;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Equipment
exports.create = async (req, res) => {
    const { type, name, number, userId } = req.body;
    if (!type || !name || !number) {
        res.send({
            message: "Parameters missing!"
        });
        return;
    }

    try {
        // Check that user is allowed to book this equipment
        const user = await User.findByPk(userId);
        if (user.role === 'admin' || user.role === 'moderator') {
            // Check if type exists
            let equipmentType = await Type.findOne({ where: { name: type } });
            if (!equipmentType) {
                equipmentType = await Type.create({ name: type });
            }

            // Check if name exists
            let equipmentName = await Name.findOne({ where: { name: name, equipmentTypeId: equipmentType.id } });
            if (!equipmentName) {
                equipmentName = await Name.create({ name: name, equipmentTypeId: equipmentType.id });
            }

            // Check if equipment exists
            const existingEquipment = await Equipment.findOne({ where: { number: number, equipmentNameId: equipmentName.id } });
            if (existingEquipment) {
                res.send({
                    message: "Equipment with the same name and number already exists!"
                });
                return;
            }

            // Create new equipment
            await Equipment.create({
                equipmentNameId: equipmentName.id,
                number: number
            });
            res.status(200).send({ message: 'Equipment added!' });
        } else {
            res.send({
                message: "Only admin and moderator can add equipment!"
            });
            return;
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while creating equipment.'
        });
    }
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

        /** get all the equipment types available in db */
        if (!type && !equipmentNameId) {
            const types = await Type.findAll({ attributes: ['name'] });
            return res.json(types.map(type => type.name));
        }

        /** get equipment type name for provided equipment name */
        if (equipmentNameId && !type) {
            const type = await Name.findOne({
                where: { id: equipmentNameId },
                include: {
                    model: Type,
                    attributes: ["name"]
                }
            });
            return res.json(type.equipment_type.name);
        }

        /** get equipment names for provided equipment type */
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
        }

        /** get equipment numbers */
        const equipment = await Equipment.findAll({
            include: [{
                model: Name,
                where: { id: equipmentNameId },
                attributes: []
            }],
            attributes: ['number', 'id'],
            order: [['number', 'asc']]
        });
        /** return equipment numbers */
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
