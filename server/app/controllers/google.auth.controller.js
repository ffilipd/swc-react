const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
require("dotenv/config");


exports.googleAuth = async (req, res) => {
    const { tokens } = req.body.code;

    const ticket = await client.verifyIdToken({
        idToken: tokens.idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();
    console.log(payload)
}