const db = require("../models");
const Booking = db.booking;
const Op = db.Sequelize.Op;
const now = new Date();
const currentHHMM = `${now.getHours()}:${now.getMinutes()}`;

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
    const { equipment_type, equipmentNameId, equipmentId, date, time_from, time_to } = req.query;
    const { Equipment, Name } = db.equipment;
    const User = db.user;

    const equipmentIdSearch = equipmentNameId ? { equipmentNameId: equipmentNameId } : {};

    try {
        const bookings = await Booking.findAll({
            where: {
                [Op.and]: {
                    date: { [Op.eq]: date },
                    [Op.or]: {
                        time_from: {
                            [Op.or]: {
                                [Op.gte]: currentHHMM,
                                [Op.and]: {
                                    [Op.gte]: time_from,
                                    [Op.lt]: time_to
                                }
                            }
                        },
                        time_to: {
                            [Op.or]: {
                                [Op.gt]: time_from || currentHHMM,
                                [Op.and]: {
                                    [Op.gt]: time_from,
                                    [Op.lt]: time_to
                                },
                            }
                        }
                    }
                }
            },
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
        });

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
