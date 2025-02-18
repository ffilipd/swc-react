const db = require("../models");
const Op = db.Sequelize.Op;
const Booking = db.booking;
const Report = db.report;
const User = db.user;
const { Equipment, Name } = db.equipment;

const dayjs = require('dayjs')
const customParseFormat = require('dayjs')
dayjs.extend(customParseFormat);
const today = dayjs().format('YYYY-MM-DD');
const now = dayjs().format('HH:mm');

const formatDate = (date) => {
    return date.split('-').reverse().join('-');
}

// Create and Save a new Booking
exports.create = async (req, res) => {
    const { date, time_from, time_to, equipmentId, userId } = req.body;
    if (!equipmentId) {
        res.send({
            message: "Content cannot be empty!"
        });
        return;
    }

    try {
        // Check that user are allowed to book this equipment
        const user = await User.findByPk(userId);
        // users has access to
        const userAccess = user.access?.split(',');
        // get name of the equipment user tries to book
        const equipment = await Equipment.findOne({
            where: { id: equipmentId },
            include: {
                model: Name,
                attributes: ['name']
            }
        });
        if (!userAccess || !userAccess.includes('all') && !userAccess.includes(equipment.equipment_name.name)) {
            return res.send({ message: 'Looks like you cannot book this equipment' });
        }

        await Booking.create({
            date: formatDate(date),
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

    const currentHHMM = formatDate(date) == today ? now : '';
    const equipmentIdSearch = equipmentNameId ? { equipmentNameId: equipmentNameId } : {};

    let bookingsWhere = usage === 'booking' ? {
        userId: userId ?? { [Op.gt]: '' },
        [Op.and]: {
            date: { [Op.eq]: formatDate(date) },
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
    } : usage === 'report' ? {
        userId: userId ?? { [Op.gt]: '' },
        date: { [Op.eq]: formatDate(date) },
    } : usage === 'edit' && {
        userId: userId ?? { [Op.gt]: '' },
    }




    let bookingsQuery = {
        where: bookingsWhere,
        order: [
            ['date', 'DESC'],
            ['time_from', 'ASC'],
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
            },
            {
                model: Report,
                attributes: ['damageType', 'description'],
            }
        ]
    }


    try {
        const bookings = await Booking.findAll(bookingsQuery);
        const formattedBookings = bookings.map(booking => {
            return {
                id: booking.id,
                date: formatDate(booking.date),
                time_from: booking.time_from,
                time_to: booking.time_to,
                equipmentId: booking.equipment.id,
                equipment_name: booking.equipment.equipment_name.name,
                equipment_number: booking.equipment.number,
                user_name: booking.user.name,
                damage_type: booking.report ? booking.report.damageType : '',
                damage_description: booking.report ? booking.report.description : '',
                reportId: booking.report ? booking.report.id : ''
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
exports.delete = async (req, res) => {
    const bookingId = req.params.id
    try {
        await Booking.destroy({ where: { id: bookingId } })
        res.status(200).send({ message: 'Booking deleted!' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting booking: ' + error });
    }
};
