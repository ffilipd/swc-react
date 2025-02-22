const db = require("../models");
const { Equipment, Type, Name } = db.equipment;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Equipment
exports.create = async (req, res) => {
    const { type, name, number } = req.body;
    if (!type || !name || !number) {
        res.send({
            message: "Parameters missing!"
        });
        return;
    }

    try {
        // Check if type exists
        let typeInstance = await Type.findOne({
            where: { name: type }
        });

        // If type does not exist, create a new type
        if (!typeInstance) {
            typeInstance = await Type.create({ name: type });
        }

        // Check for duplicate equipment
        const dupletEquipment = await Equipment.findOne({
            where: { number: number },
            include: {
                model: Name,
                where: { name: name }
            }
        });

        if (dupletEquipment) {
            res.send({
                message: "Equipment with the same name and number already exists!"
            });
            return;
        }

        // Find or create the equipment name
        let equipmentName = await Name.findOne({
            where: { name: name }
        });

        if (!equipmentName) {
            equipmentName = await Name.create({ name: name, equipmentTypeId: typeInstance.id });
        }

        // Create the equipment
        await Equipment.create({
            equipmentNameId: equipmentName.id,
            number: number
        });

        res.status(200).send({ message: 'Equipment added!' });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while creating equipment.'
        });
    }
};

// Retrieve all Equipment from the database.
exports.findAll = async (req, res) => {
    const userId = req.userId; // Assuming userId is available in the request

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const equipment = await Equipment.findAll({
            include: [
                {
                    model: Name,
                    include: [
                        {
                            model: Type,
                            attributes: ['name']
                        }
                    ],
                    attributes: ['name']
                }
            ]
        });

        if (user.role === 'admin' || user.role === 'moderator') {
            res.json(equipment);
            return;
        }
        const filteredEquipment = equipment.filter(equip => {
            const typeName = equip.name.equipment_type.name;
            const nameString = equip.name.name;
            return user.access.includes(typeName) && user.access.includes(nameString);
        });

        res.json(filteredEquipment);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error occurred while retrieving equipment.' });
    }
};

// Retrieve Equipment Tree from the database.
exports.findEquipmentTree = async (req, res) => {
    const userId = req.userId; // Assuming userId is available in the request

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

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

        // Filter the equipment tree based on user access
        if (user.role === 'admin' || user.role === 'moderator') {
            res.send(formattedEquipmentTree);
            return;
        }

        const filteredEquipmentTree = formattedEquipmentTree.filter(type => {
            return user.access.includes(type.typeName);
        });

        res.send(filteredEquipmentTree);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Error fetching equipment tree' });
    }
};

// Retrieve Equipment filters.
exports.findFilters = async (req, res) => {
    const userId = req.userId; // Assuming userId is available in the request

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }

        const { equipmentNameId, type } = req.query;

        /** get all the equipment types available in db */
        if (!type && !equipmentNameId) {
            const types = await Type.findAll({ attributes: ['name'] });
            const filteredTypes = types.filter(type => user.access.includes(type.name));
            return res.json(filteredTypes.map(type => type.name));
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

            if (user.role === 'admin' || user.role === 'moderator') {
                return res.json(type.equipment_type.name);
            }

            if (!user.access.includes(type.equipment_type.name)) {
                res.status(403).send({ message: 'Access denied' });
                return;
            }

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

            if (user.role === 'admin' || user.role === 'moderator') {
                const names = specificType.equipment_names.map(data => {
                    return {
                        name: data.name,
                        id: data.id
                    }
                });
                return res.json(names);
            }

            if (!user.access.includes(type)) {
                res.status(403).send({ message: 'Access denied' });
                return;
            }

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
exports.delete = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!id) {
        res.status(400).send({ message: 'ID missing!' });
        return;
    }

    try {
        const equipment = await Equipment.findByPk(id);

        if (!equipment) {
            res.status(404).send({ message: 'Equipment not found' });
            return;
        }

        await equipment.destroy();
        res.status(200).send({ message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

// New function to get the ID by type, name, and number
exports.findEquipmentId = async (req, res) => {
    const { type, name, number } = req.query;

    if (!type || !name || !number) {
        res.status(400).send({ message: 'Parameters missing!' });
        return;
    }

    try {
        const equipment = await Equipment.findOne({
            include: [{
                model: Name,
                where: { name: name },
                include: [{
                    model: Type,
                    where: { name: type }
                }]
            }],
            where: { number: number },
            attributes: ['id']
        });

        if (equipment) {
            res.json(equipment.id);
        } else {
            res.status(404).send({ message: 'Equipment not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
