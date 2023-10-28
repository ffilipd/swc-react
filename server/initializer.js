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
                            email: 'admin@fleetmad.com',
                            password: bcrypt.hashSync('admin', salt),
                            active: true,
                            roleId: 3
                        })
                    }
                })
        })
        .then(() => {
            Equipment.Type.count()
                .then((count) => {
                    if (count < 1) {
                        // create default equipment types
                        Equipment.Type.create({
                            name: 'Sailboat'
                        })
                        Equipment.Type.create({
                            name: 'Motorboat'
                        })
                        Equipment.Type.create({
                            name: 'Windsurfing board'
                        })
                        Equipment.Type.create({
                            name: 'Windsurfing sail'
                        })
                    }
                })
        })
        .then(() => {
            Equipment.Name.count()
                .then(count => {
                    if (count < 1) {
                        Equipment.Name.create({
                            name: "Elliott 6M",
                            equipmentTypeId: 1
                        })
                        Equipment.Name.create({
                            name: "RS Toura",
                            equipmentTypeId: 1
                        })
                        Equipment.Name.create({
                            name: "J/70",
                            equipmentTypeId: 1
                        })
                    }
                })
        })
        .then(() => {
            Equipment.Equipment.count()
                .then(count => {
                    if (count < 1) {
                        Equipment.Equipment.create({
                            number: '1',
                            equipmentNameId: 3,
                            equipmentTypeId: 1
                        })
                        for (let i = 1; i < 7; i++) {
                            Equipment.Equipment.create({
                                number: i,
                                equipmentNameId: 2,
                                equipmentTypeId: 1
                            })
                        }
                        for (let i = 1; i < 7; i++) {
                            Equipment.Equipment.create({
                                number: i,
                                equipmentNameId: 1,
                                equipmentTypeId: 1
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