const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));


const data = require('./data')

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
    const { date, type, equipment_name, time_from, time_to, swc_number } = req.query;
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

    res.json(filteredData);
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
