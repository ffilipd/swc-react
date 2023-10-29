const db = require("../models");
const Op = db.Sequelize.Op;
const Booking = db.booking;
const User = db.user;
const { Equipment, Name } = db.equipment;

const dayjs = require('dayjs')
const customParseFormat = require('dayjs')
dayjs.extend(customParseFormat);
const today = dayjs().format('DD-MM-YYYY');
const now = dayjs().format('HH:mm');

// Create and Save a new Booking
exports.create = async (req, res) => {
    const { date, time_from, time_to, equipmentId, userId } = req.body;
    if (!equipmentId) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }

    try {
        await Booking.create({
            date: date,
            time_from: time_from,
            time_to: time_to,
            equipmentId: equipmentId,
            userId: userId
        })
        res.status(200).send({ message: 'Booking added!' })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Error occurred while creating booking.'
        });
    }
};

// Retrieve all Booking from the database.
exports.findAll = async (req, res) => {
    const { equipmentNameId, equipmentId, date, time_from, time_to, userId, usage } = req.query;

    const currentHHMM = date == today ? now : '';
    const equipmentIdSearch = equipmentNameId ? { equipmentNameId: equipmentNameId } : {};

    let bookingsWhere = usage === 'booking' ? {
        userId: userId ?? { [Op.gt]: '' },
        [Op.and]: {
            date: { [Op.eq]: date },
            [Op.or]: {
                time_from: {
                    [Op.or]: {
                        [Op.gte]: time_from ?? currentHHMM,
                        [Op.and]: {
                            [Op.gte]: time_from,
                            [Op.lt]: time_to
                        }
                    }
                },
                time_to: {
                    [Op.or]: {
                        [Op.gt]: time_from ?? currentHHMM,
                        [Op.and]: {
                            [Op.gt]: time_from,
                            [Op.lt]: time_to
                        },
                    }
                }
            }
        }
    } : usage === 'report' && {
        userId: userId ?? { [Op.gt]: '' },
        date: { [Op.eq]: date },
    }



    let bookingsQuery = {
        where: bookingsWhere,
        order: [
            ['time_from', 'ASC']
        ],
        attributes: ['id', 'date', 'time_from', 'time_to'],
        include: [
            {
                model: Equipment,
                attributes: ['number', 'id'],
                where: equipmentIdSearch,
                include: [
                    {
                        model: Name,
                        attributes: ['name'],
                    }
                ]
            },
            {
                model: User,
                attributes: ['name']
            }
        ]
    }


    try {
        const bookings = await Booking.findAll(bookingsQuery);
        const formattedBookings = bookings.map(booking => {
            return {
                id: booking.id,
                date: booking.date,
                time_from: booking.time_from,
                time_to: booking.time_to,
                equipmentId: booking.equipment.id,
                equipment_name: booking.equipment.equipment_name.name,
                equipment_number: booking.equipment.number,
                user_name: booking.user.name
            }
        })
        res.json(formattedBookings);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error occurred while retrieving bookings.' });
    }
};

// Retrieve Booking filters.
exports.findFilters = async (req, res) => {
    // try {
    //     const { booking_name, type } = req.query;

    //     if (!type) {
    //         const types = await Type.findAll({ attributes: ['name'] });
    //         return res.json(types.map(type => type.name));
    //     }

    //     if (!booking_name) {
    //         const names = await Name.findAll({ attributes: ['name'] });
    //         return res.json(names.map(name => name.name));
    //     }

    //     const booking = await Booking.findAll({
    //         include: [{
    //             model: Name,
    //             where: { name: booking_name }
    //         }],
    //         attributes: ['number']
    //     });

    //     const numbersArray = booking.map(booking => booking.number).sort();
    //     res.json(numbersArray);
    // } catch (error) {
    //     console.error('Error:', error);
    //     res.status(500).send({ message: 'Internal Server Error' });
    // }
};

// Find a single Booking with an id
exports.findOne = (req, res) => {

};

// Update a Booking by the id in the request
exports.update = (req, res) => {

};

// Delete a Booking with the specified id in the request
exports.delete = (req, res) => {

};
