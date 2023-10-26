const db = require("../models");
const { Equipment } = db.equipment;
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
                message: err.message || "Error occuered while retrieving users."
            })
        })
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
