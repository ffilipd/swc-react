const { isAdmin } = require("../middleware/authJwt");
const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require('jsonwebtoken')
const { userUpdateSanityCheck } = require('./helpers');

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
            exclude: ['id'],
            include: [
                [db.Sequelize.col('id'), 'id'],
                [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('createdAt'), '%d-%m-%Y'), 'created_date'],
                [db.Sequelize.fn('DATE_FORMAT', db.Sequelize.col('last_login'), '%d-%m-%Y %H:%i:%s'), 'last_login']
            ]
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
exports.update = async (req, res) => {
    const userToUpdateId = req.params.id; // user id to update
    const { last_login, ...updateData } = req.body; // Exclude last_login since it's different format than sequelize expects and not really important for the action
    const userId = req.userId; // user id from token
    const userUpdatableFields = ['email', 'name', 'language', 'password'];


    try {
        // if user is not admin, check if the user is trying to update their own data
        const requestUser = await User.findOne({ where: { id: userId } });
        if (userToUpdateId !== userId && requestUser.role !== 'admin') {
            return res.status(403).send({
                message: "Unauthorized!"
            });
        }

        // if user is not admin, check if the user is trying to update fields that are not allowed
        if (requestUser.role !== 'admin') {
            for (const key in updateData) {
                if (!userUpdatableFields.includes(key)) {
                    return res.status(403).send({
                        message: `Unauthorized! Field ${key} cannot be updated.`
                    });
                }
            }
        }

        // Prevent id from being updated
        delete updateData.id;

        // Sanity checks
        await userUpdateSanityCheck({ userToUpdateId: userToUpdateId, updateData: updateData, res: res });

        // Proceed to update the user
        const num = await User.update(updateData, { where: { id: userToUpdateId } });
        if (num[0] === 1) {
            res.send({
                message: "User successfully updated!"
            });
        } else {
            res.send({
                message: `Cannot update user with id=${userToUpdateId}. Maybe User was not found or req.body was empty!`
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error updating User with id=" + userToUpdateId
        });
    }
};




// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the user to be deleted is an admin
        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            return res.status(404).send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }

        if (user.role === 'admin') {
            // Count the number of admin users
            const adminCount = await User.count({ where: { role: 'admin' } });
            if (adminCount === 1) {
                return res.status(400).send({
                    message: "Cannot delete the only admin user."
                });
            }
        }

        // Proceed to delete the user
        const num = await User.destroy({ where: { id: id } });
        if (num === 1) {
            res.send({
                message: "User was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Could not delete User with id=" + id
        });
    }
};



function generateUniqueId() {
    // Generate uuid
    return v4();
}