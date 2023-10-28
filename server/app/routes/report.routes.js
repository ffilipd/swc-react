const { authJwt } = require("../middleware");
const report = require("../controllers/report.controller.js");
const router = require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Create a new report
    router.post("/",
        [authJwt.verifyToken],
        report.create
    );

    // Retrieve all report
    router.get("/",
        [authJwt.verifyToken],
        report.findAll);

    // Retrieve damage types
    router.get("/damage-types",
        [authJwt.verifyToken],
        report.findAllDamageTypes);

    // Retrieve report filters
    router.get("/filters",
        [authJwt.verifyToken],
        report.findFilters);

    // Retrieve a single report with id
    router.get("/:id",
        [authJwt.verifyToken],
        report.findOne);

    // Update a report with id
    router.put("/:id",
        [authJwt.verifyToken],
        report.update);

    // Delete a report with id
    router.delete("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        report.delete);

    app.use('/api/report', router);
};