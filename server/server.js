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
const Role = db.role;
const User = db.user;

// DEV
// db.sequelize.sync({ force: true })
//     .then(() => {
//         console.log("Drop and re-sync db.");
//     });

//Production mode
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
                if (count === 0) {
                    // create default admin user
                    User.create({
                        name: 'admin',
                        email: 'admin@fleetmad.com',
                        password: bcrypt.hashSync('admin', salt),
                        active: true,
                        role: "admin"
                    })
                }
            })
    })




require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/equipment.routes')(app);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
