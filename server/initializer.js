const db = require("./app/models");
const User = db.user;
const Equipment = db.equipment;
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const resetDB = async () => {
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
};

const initializeDB = async () => {
    db.sequelize
        .sync()
        .then(() => {
            User.count().then((count) => {
                if (count < 1) {
                    // create default admin user
                    User.create({
                        name: "admin",
                        email: "admin@fleetmad.com",
                        password: bcrypt.hashSync("admin", salt),
                        active: true,
                        role: "admin",
                        access: "all",
                        first_point_given: new Date(),
                        latest_point_given: new Date(),
                    });
                }
            });
        })
        .catch((err) => {
            console.error("Error initializing DB: " + err);
        });
};

module.exports = { initializeDB, resetDB };