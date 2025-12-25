const express = require('express');
const cors = require('cors');
const winston = require('winston');
require("dotenv/config");

const app = express();
const PORT = process.env.APP_PORT || 8000;

// Create a winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'server-traffic.log' })
    ]
});

app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Custom middleware to log requests
// app.use((req, res, next) => {
//     logger.info({
//         method: req.method,
//         url: req.url,
//         headers: req.headers,
//         body: req.body
//     });
//     next();
// });

app.use(cors({
    origin: '*', // Replace with your allowed origin
    allowedHeaders: "Access-Control-Allow-Headers, x-access-token, Content-Type, Accept",
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { initializeDB, resetDB } = require('./initializer');

// resetDB()
initializeDB()
    .then(() => {
        const router = express.Router();
        require('./app/routes/auth.routes')(router);
        require('./app/routes/user.routes')(router);
        require('./app/routes/equipment.routes')(router);
        require('./app/routes/booking.routes')(router);
        require('./app/routes/report.routes')(router);

        app.use('/api', router);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error Initializing database: ' + err)
    });
