const db = require("../models");
const Report = db.report;
const Op = db.Sequelize.Op;

// Create and Save a new Report
exports.create = async (req, res) => {
    const { bookingId, damageType, description } = req.body;
    if (!bookingId) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    try {
        const report = await Report.create({
            bookingId,
            damageType,
            description
        })
        res.status(200).send({ message: 'Report added!' })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while creating report.'
        });
    }
};

// Retrieve all Report from the database.
exports.findAll = async (req, res) => {

};

exports.findAllDamageTypes = async (req, res) => {
    try {
        const types = await Damage_Type.findAll()
        const typesArray = types.map(type => {
            return ({
                id: type.id,
                name: type.name
            })
        })
        res.json(typesArray);
    } catch (error) {
        res.status(500).send({
            message: 'Error occurred while fetching damage types.'
        });
    }
};

// Retrieve Report filters.
exports.findFilters = async (req, res) => {
    // try {
    //     const { report_name, type } = req.query;

    //     if (!type) {
    //         const types = await Type.findAll({ attributes: ['name'] });
    //         return res.json(types.map(type => type.name));
    //     }

    //     if (!report_name) {
    //         const names = await Name.findAll({ attributes: ['name'] });
    //         return res.json(names.map(name => name.name));
    //     }

    //     const report = await Report.findAll({
    //         include: [{
    //             model: Name,
    //             where: { name: report_name }
    //         }],
    //         attributes: ['number']
    //     });

    //     const numbersArray = report.map(report => report.number).sort();
    //     res.json(numbersArray);
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).send({ message: 'Internal Server Error' });
    // }
};

// Find a single Report with an id
exports.findOne = async (req, res) => {
    try {
        const report = await Report.findOne({
            where: {
                bookingId: req.params.id
            },
        });
        if (report) {
            return res.json(report);
        }
        res.status(200).send();
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error occurred while retrieving reports.' });
    }
};

// Update a Report by the id in the request
exports.update = (req, res) => {

};

// Delete a Report with the specified id in the request
exports.delete = (req, res) => {

};
