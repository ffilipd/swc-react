const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken')

// Create and Save a new User
exports.create = async (req, res) => {
    const { email, name, language } = req.body;
    if (!email) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    try {
        let user = await User.findOne({ where: { email: email } });

        // If user does not exist, create a new user
        if (user === null) {
            user = await User.create({
                email: email,
                name: name
            });
        } else {
            // Update last_login if the user already exists
            await user.update({ last_login: new Date() });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.GOOGLE_CLIENT_SECRET, {
            expiresIn: '1h' // Token expiration time, adjust as needed
        });

        // Return the token and user data
        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                last_login: user.last_login,
                role: user.role,
                active: user.active,
                rejected: user.rejected,
                language: user.language,
                access: user.access
                // Add other user properties as needed
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while creating/updating user.'
        });
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
    const { id } = req.params;

    User.findOne({
        where: { id },
        attributes: {
            exclude: ['password']
        }
    })
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
            if (num[0] === 1) {
                res.send({
                    message: "User successfully updated. You might need to log in again for the changes to take effect"
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