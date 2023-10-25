const express = require('express');
const session = require('express-session');
const axios = require('axios')
const cors = require('cors');
const db = require("./app/models");
const passport = require('./app/controllers/auth/passport');
require("dotenv/config");
const { OAuth2Client, UserRefreshClient } = require('google-auth-library')

const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', // Replace with your allowed origin
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
    // 'https://www.googleapis.com/auth/userinfo.profile'
)


app.post('/api/auth/google', async (req, res) => {
    const { code } = req.body;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        const { access_token } = tokens;

        // Use the access token to fetch user's profile data
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })

        // `data` contains the user's profile information
        console.debug(data);

        // You can send the user's profile information in the response
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting user profile.');
    }
})

app.post('/api/auth/google/refresh-token', async (req, res) => {
    const user = new UserRefreshClient(
        clientId,
        clientSecret,
        req.body.refreshToken,
    );
    user.refreshAccessToken()
        .then(credentials => {
            res.json(credentials);
        })
        .catch(err => {
            res.status(500).send("Error getting refresh token.")
        })
})

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

require("./app/routes/user.routes")(app);
require("./app/routes/equipment.routes")(app);


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
