const { authJwt } = require("../middleware");
const users = require("../controllers/user.controller.js");
const router = require("express").Router();

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
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
        [authJwt.verifyToken, authJwt.isAdmin],
        users.update
    );

    // Delete a user with id
    router.delete("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.delete
    );

    app.use('/api/users', router);
};