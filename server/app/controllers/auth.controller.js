const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const axios = require('axios');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
require("dotenv/config");


exports.googleAuth = async (req, res) => {
    const accessToken = req.body.code
    try {
        const googleProfile = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const { data } = googleProfile;
        User.findOne({
            where: { email: data.email }
        })
            .then(user => {
                if (!user) {
                    User.create({
                        name: data.name,
                        email: data.email,
                    })
                        .then(user => {
                            return res.status(401).send({ message: "User was registered successfully!" })
                        })
                        .catch(error => {
                            return res.status(500).send("error creating user: " + error)
                        })
                }
                if (!user.active) {
                    return res.status(401).send({ message: "User has not been approved yet, please try again later" })
                }
                if (user.rejected) {
                    return res.status(401).send({
                        accessToken: null,
                        message: 'This user has been rejected. If you think that is incorrect, please contact Admin!'
                    })
                }
                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 60 * 6 // 6 hours
                });

                user.update({ last_login: new Date() });

                res.status(200).send({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    last_login: user.last_login,
                    accessToken: token,
                    language: user.language,
                    access: user.access
                });
            })
            .catch(err => {
                console.error(err)
            })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}


exports.signup = (req, res) => {
    // Save User to Database
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt)
    })
        .then(user => {
            res.send({ message: "User was registered successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            email: req.body.name
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "Invalid Username or Password!" });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Username or Password!"
                });
            }

            if (user.rejected) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'This user has been rejected. If you think that is incorrect, please contact Admin!'
                })
            }

            if (!user.active) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'User has not been approved yet. Try again later or contact Admin!'
                })
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 60 * 6 // 6 hours
            });

            user.update({ last_login: new Date() });

            res.status(200).send({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                last_login: user.last_login,
                accessToken: token,
                language: user.language,
                access: user.access
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};