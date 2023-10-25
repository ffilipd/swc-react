const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4 } = require('uuid');
require("dotenv/config");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const db = require("./app/models")

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));


db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});


// const data = require('./data')
let data = {}

const dataFilePath = './data.json';

// Load existing data from data.json
try {
    data = JSON.parse(fs.readFileSync(dataFilePath));
} catch (error) {
    console.log('Error loading data:', error);
}

const GOOGLE_CLIENT_ID = "831888852855-cj7q4hnj4a2c7d2imre8aj5ju7ptqvrd.apps.googleusercontent.com"
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });
        return { payload: ticket.getPayload() };
    } catch (error) {
        return { error: "Invalid user detected. Please try again" }
    }
}


app.get('/equipment', (req, res) => {
    const { type, equipment_name, swc_number } = req.query;
    let filteredData = data.equipment;

    if (type) {
        filteredData = filteredData.filter(item => item.type === type);
    }

    if (equipment_name) {
        filteredData = filteredData.filter(item => item.equipment_name === equipment_name);
    }

    if (swc_number) {
        filteredData = filteredData.filter(item => item.swc_number === swc_number);
    }

    res.json(filteredData);
});

// Endpoint to handle /equipment/filters
app.get('/equipment/filters', (req, res) => {
    const { type, equipment_name } = req.query;
    let filteredData = Object.values(data.equipment);

    // Filter based on type parameter
    if (type) {
        filteredData = filteredData.filter(item => item.type === type);
    }
    // Filter based on name parameter if provided
    if (equipment_name) {
        filteredData = filteredData.filter(item => item.equipment_name === equipment_name);
    }

    // Return unique names or unique numbers based on parameters
    if (type && equipment_name) {
        const uniqueNumbers = [...new Set(filteredData.map(item => item.swc_number))];
        res.json(uniqueNumbers);
    } else if (type) {
        const uniqueNames = [...new Set(filteredData.map(item => item.equipment_name))];
        res.json(uniqueNames);
    } else {
        const uniqueTypes = [...new Set(filteredData.map(item => item.type))];
        res.json(uniqueTypes);
    }
});

app.get('/bookings', (req, res) => {
    const { date, type, equipment_name, time_from, time_to, swc_number, user_id } = req.query;
    let filteredData = data.bookings;

    if (date) {
        filteredData = filteredData.filter(item => item.date === date);
    }

    if (type) {
        filteredData = filteredData.filter(item => item.type === type);
    }

    if (equipment_name) {
        filteredData = filteredData.filter(item => item.equipment_name === equipment_name);
    }

    if (time_from) {
        filteredData = filteredData.filter(item => {
            const reqTimeFrom = parseInt(time_from.split(':').join(''));
            const bookingTimeFrom = parseInt(item.time_from.split(':').join(''));
            const bookingTimeTo = parseInt(item.time_to.split(':').join(''));
            if (time_to) {
                const reqTimeTo = parseInt(time_to.split(':').join(''));
                return reqTimeFrom >= bookingTimeFrom &&
                    reqTimeFrom < bookingTimeTo ||
                    reqTimeTo > bookingTimeFrom &&
                    reqTimeTo < bookingTimeTo
            } else {
                return reqTimeFrom >= bookingTimeFrom && reqTimeFrom < bookingTimeTo || reqTimeFrom < bookingTimeTo
            }
        })
    }


    if (swc_number) {
        filteredData = filteredData.filter(item => item.swc_number === swc_number);
    }
    if (user_id) {
        filteredData = filteredData.filter(item => item.user_id === user_id);
    }

    res.json(filteredData);
});

app.get('/report', (req, res) => {
    const { date, type, equipment_name, swc_number, user_id, booking_id, damage_type } = req.query;
    let filteredData = data.reports;

    if (date) {
        filteredData = filteredData.filter(item => item.date === date);
    }

    if (type) {
        filteredData = filteredData.filter(item => item.type === type);
    }

    if (equipment_name) {
        filteredData = filteredData.filter(item => item.equipment_name === equipment_name);
    }

    if (swc_number) {
        filteredData = filteredData.filter(item => item.swc_number === swc_number);
    }

    if (user_id) {
        filteredData = filteredData.filter(item => item.user_id === user_id);
    }

    if (booking_id) {
        filteredData = filteredData.filter(item => item.booking_id === booking_id);
    }

    if (damage_type) {
        filteredData = filteredData.filter(item => item.damage_type === damage_type);
    }

    res.json(filteredData);
});

app.post('/bookings', (req, res) => {
    const newBooking = req.body;
    newBooking.id = generateUniqueId();

    // Add the new booking to the bookings array in data.json
    data.bookings.push(newBooking);

    // Save the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    res.status(201).json(newBooking);
});
app.post('/report', (req, res) => {
    const newReport = req.body;
    newReport.id = generateUniqueId();

    // Add the new booking to the bookings array in data.json
    data.reports.push(newReport);

    // Save the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    res.status(201).json(newReport);
});

app.post('/users', async (req, res) => {
    const user = req.body;
    const credentials = user.credential;

    try {
        if (credentials) {
            const verificationResponse = await verifyGoogleToken(credentials);

            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error
                })
            }
            const profile = verificationResponse?.payload;
            console.log(profile)
        }
    } catch (err) {
        console.log(err)
    }
    // check if user exists
    const existsingUser = data.users.findIndex((existsingUser) => existsingUser.email === user.email)

    if (existsingUser === -1) {
        // Add the new user to the bookings array in data.json
        user.id = generateUniqueId();
        user.created_date = new Date();
        user.role = 'viewer';
        if (!user.language) user.language = 'en';
        console.log('user did not exist')
        data.users.push(user);
    } else {
        data.users[existsingUser].last_login = new Date();
    }

    const userProfile = data.users.find((existinguser) => existinguser.email === user.email)

    // Save the updated data back to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    res.status(201).json(userProfile);
});

function generateUniqueId() {
    // Generate uuid
    return v4();
}

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
