const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            // authJwt.verifyToken, authJwt.isAdmin,
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/api/auth/google", controller.googleAuth);
    app.post("/api/auth/signin", controller.signin);
};