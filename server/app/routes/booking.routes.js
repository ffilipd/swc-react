const { authJwt } = require("../middleware");
const booking = require("../controllers/booking.controller.js");
const router = require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new booking
    router.post("/",
        [authJwt.verifyToken],
        booking.create
    );

    // Retrieve all booking
    router.get("/",
        [authJwt.verifyToken],
        booking.findAll);

    // Retrieve booking filters
    router.get("/filters",
        [authJwt.verifyToken],
        booking.findFilters);

    // Retrieve a single booking with id
    router.get("/:id",
        [authJwt.verifyToken],
        booking.findOne);

    // Update a booking with id
    router.put("/:id",
        [authJwt.verifyToken],
        booking.update);

    // Delete a booking with id
    router.delete("/:id",
        [authJwt.verifyToken],
        booking.delete);

    app.use('/api/bookings', router);
};