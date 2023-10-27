const express = require('express');
const cors = require('cors');
require("dotenv/config");


const app = express();
const PORT = process.env.APP_PORT || 8000;

app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initalizeDB = require('./initializer');

// DEV
// db.sequelize.sync({ force: true })
//     .then(() => {
//         console.log("Drop and re-sync db.");
//     });

initalizeDB()
    .then(() => {
        require('./app/routes/auth.routes')(app);
        require('./app/routes/user.routes')(app);
        require('./app/routes/equipment.routes')(app);
        require('./app/routes/booking.routes')(app);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error Initializing database: ' + err)
    })
