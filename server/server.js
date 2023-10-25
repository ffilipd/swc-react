const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv/config");
// const { OAuth2Client } = require("google-auth-library");
// const jwt = require("jsonwebtoken");
const db = require("./app/models")

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));


// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });


// const GOOGLE_CLIENT_ID = "831888852855-cj7q4hnj4a2c7d2imre8aj5ju7ptqvrd.apps.googleusercontent.com"
// const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// async function verifyGoogleToken(token) {
//     try {
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: GOOGLE_CLIENT_ID
//         });
//         return { payload: ticket.getPayload() };
//     } catch (error) {
//         return { error: "Invalid user detected. Please try again" }
//     }
// }

require("./app/routes/user.routes")(app);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
