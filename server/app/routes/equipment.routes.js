
module.exports = app => {
    const equipment = require("../controllers/user.controller.js");
    const router = require("express").Router();

    // Create a new user
    router.post("/", equipment.create);

    // Retrieve all equipment
    router.get("/", equipment.findAll);

    // Retrieve a single user with id
    router.get("/:id", equipment.findOne);

    // Update a user with id
    router.put("/:id", equipment.update);

    // Delete a user with id
    router.delete("/:id", equipment.delete);

    app.use('/api/equipment', router);
};