const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Email is already in use!"
            });
            return;
        }

        next();
    });
};

checkRolesExisted = (req, res, next) => {
    const roles = req.body.roles;
    if (roles) {
        for (let i = 0; i < roles.get.length; i++) {
            if (!ROLES.includes(roles[i])) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + roles[i]
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;