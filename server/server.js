const express = require('express');
const cors = require('cors');
require("dotenv/config");
var bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const app = express();
const PORT = process.env.APP_PORT || 8000;

app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const { Role, User } = db.user;
const Equipment = db.equipment;
const { Damage_Type, Report } = db.report;
const Booking = db.booking;

// DEV
// db.sequelize.sync({ force: true })
//     .then(() => {
//         console.log("Drop and re-sync db.");
//     });

// Production mode
db.sequelize.sync()
    .then(() => {
        Role.count()
            .then(rolesNumber => {
                if (rolesNumber === 0) {
                    console.log('creating default roles')
                    Role.create({
                        id: 1,
                        name: "user"
                    });

                    Role.create({
                        id: 2,
                        name: "moderator"
                    });

                    Role.create({
                        id: 3,
                        name: "admin"
                    });
                }
            })
    })
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
                if (count === 0) {
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
                        name: "Elliott 6M"
                    })
                    Equipment.Name.create({
                        name: "RS Toura"
                    })
                    Equipment.Name.create({
                        name: "J/70"
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
                        equipmentNameId: 1,
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
                            equipmentNameId: 3,
                            equipmentTypeId: 1
                        })
                    }
                }
            })
    })
    .then(() => {
        Damage_Type.count()
            .then(count => {
                if (count < 1) {
                    const types = ["major", "minor", "none", "other"];
                    for (let type in types) {
                        Damage_Type.create({
                            name: types[type]
                        })
                    }
                }
            })
    })


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/equipment.routes')(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
