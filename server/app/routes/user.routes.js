const { authJwt } = require("../middleware");
const users = require("../controllers/user.controller.js");
const router = require("express").Router();

module.exports = app => {

    // Create a new user
    router.post("/", users.create);

    // Retrieve all users
    router.get("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.findAll
    );

    // Retrieve a single user with id
    router.get("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.findOne
    );

    // Update a user with id
    router.put("/:id",
        [authJwt.verifyToken],
        users.update
    );

    // Delete a user with id
    router.delete("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.delete
    );

    app.use('/users', router);
};