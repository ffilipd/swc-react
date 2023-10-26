const db = require("../models");
const { Equipment, Type, Name } = db.equipment;
const Op = db.Sequelize.Op;

// Create and Save a new Equipment
exports.create = (req, res) => {

};

// Retrieve all Equipment from the database.
exports.findAll = (req, res) => {
    Equipment.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error occuered while retrieving equipment."
            })
        })
};

// Retrieve Equipment filters.
exports.findFilters = (req, res) => {
    const { equipment_name, type } = req.query
    if (Object.keys(req.query).length === 0) {
        Type.findAll({
            attributes: ['name']
        })
            .then(types => {
                const typeArray = types.map(type => type.name)
                res.json(typeArray)
            })
            .catch(err => {
                res.status(500).send({ message: 'Error getting equipment types' })
            })
    }
    if (type) {
        if (!equipment_name) {
            Name.findAll({
                attributes: ['name']
            })
                .then(names => {
                    const nameArray = names.map(name => name.name);
                    res.json(nameArray)
                })
                .catch(err => {
                    res.status(500).send({ message: 'Error getting equipment names' })
                })
        }
        else {
            Equipment.findAll({
                include: [{
                    model: Name,
                    where: {
                        name: equipment_name
                    }
                }],
                attributes: ['number']
            })
                .then(equipment => {
                    const numbersArray = equipment.map(equipment => equipment.number).sort()
                    res.json(numbersArray)
                })
                .catch(err => {
                    res.status(500).send({ message: 'Error getting equipment numbers' })
                })
        }
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
