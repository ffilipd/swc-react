const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

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

app.get('/bookings', (req, res) => {
    const { date, equipment_name, time_from, time_to, swc_number } = req.query;
    let filteredData = data.bookings;

    if (date) {
        filteredData = filteredData.filter(item => item.date === date);
    }

    if (equipment_name) {
        filteredData = filteredData.filter(item => item.equipment_name === equipment_name);
    }

    if (time_from) {
        filteredData = filteredData.filter(item => item.time_from === time_from);
    }

    if (time_to) {
        filteredData = filteredData.filter(item => item.time_to === time_to);
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
