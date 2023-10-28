const db = require("./app/models");
const User = db.user;
const Equipment = db.equipment;
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);



const resetDB = async () => {
    db.sequelize.sync({ force: true })
        .then(() => {
            console.log("Drop and re-sync db.");
        });
}


const initalizeDB = async () => {

    db.sequelize.sync()
        .then(() => {
            User.count()
                .then((count) => {
                    if (count < 1) {
                        // create default admin user
                        User.create({
                            name: 'admin',
                            email: 'admin.fleetmad@dahlskog.fi',
                            password: bcrypt.hashSync('admin', salt),
                            active: true,
                            role: 'admin'
                        })
                    }
                })
        })
        .then(() => {
            Equipment.count()
                .then(count => {
                    if (count < 1) {
                        Equipment.create({
                            name: "J/70",
                            type: "Sailboat",
                            number: '1',
                        })
                        for (let i = 1; i < 7; i++) {
                            Equipment.create({
                                name: "Elliott 6M",
                                type: "Sailboat",
                                number: i,
                            })
                        }
                        for (let i = 1; i < 7; i++) {
                            Equipment.create({
                                name: "RS Toura",
                                type: "Sailboat",
                                number: i,
                            })
                        }
                    }
                })
        })
        .catch(err => {
            console.error("Error initializing DB: " + err)
        })
}

module.exports = { initalizeDB, resetDB };