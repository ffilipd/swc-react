const db = require("../models");
const { v4 } = require('uuid');
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = async (req, res) => {
    const { email, name, language } = req.body;
    if (!email) {
        res.status(400).send({
            message: "Content cannot be empty!"
        })
        return;
    }

    const existingUser = await User.findOne({ where: { email: email } })

    // If not User exists, create new
    if (existingUser == null) {
        const user = {
            id: generateUniqueId(),
            email: email,
            name: name,
            language: language ?? 'en'
        }
        User.create(user)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error occured while creating user."
                })
            })
    } else {
        // Update last_login
        req.body.last_login = new Date();
        User.update(req.body, {
            where: { email: email }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "User successfully updated."
                    });
                } else {
                    res.send({
                        message: 'Cannot update user last_logn.'
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating User last_login"
                })
            })
    }
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['uuid'],
            include: [[db.Sequelize.col('uuid'), 'id']]
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error occuered while retrieving users."
            })
        })
};


// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            if (data) res.send(data)
            else res.status(404).send({ message: "Error retrieving User with id=" + id })
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            })
        })
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "User successfully updated."
                });
            } else {
                res.send({
                    message: `Cannot update user with id=${id}. Maybe User was not found or req.body was empty!`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            })
        })
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });

};

function generateUniqueId() {
    // Generate uuid
    return v4();
}