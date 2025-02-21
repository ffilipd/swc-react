const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {

    app.post(
        "/auth/signup",
        [
            // authJwt.verifyToken, authJwt.isAdmin,
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/auth/google", controller.googleAuth);
    app.post("/auth/signin", controller.signin);
};