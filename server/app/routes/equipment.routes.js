const { authJwt } = require("../middleware");
const equipment = require("../controllers/equipment.controller.js");
const router = require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new equipment
    router.post("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        equipment.create
    );

    // Retrieve all equipment
    router.get("/",
        [authJwt.verifyToken],
        equipment.findAll);

    // Retrieve equipment filters
    router.get("/filters",
        [authJwt.verifyToken],
        equipment.findFilters);

    // Retrieve a single equipment with id
    router.get("/:id",
        [authJwt.verifyToken],
        equipment.findOne);

    // Update a equipment with id
    router.put("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        equipment.update);

    // Delete a equipment with id
    router.delete("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        equipment.delete);

    app.use('/api/equipment', router);
};