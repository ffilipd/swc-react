import axios from "axios"

export const getProfileInfo = async (user: any) => {
    axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
        {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
            },
        }
    )
        .then(res => {
            return res.data;
        })
        .catch((err) => { throw new Error('Error getting profile info: ' + err) })
}