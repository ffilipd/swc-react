import axios from "axios"
import { FMProfile, Profile } from "../interfaces";
import { useUser } from "../UserContext";

const base_URL: string = process.env.REACT_APP_API_URL2 || '';
const API_ENDPOINTS = {
    USERS: '/users',
}

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

export const createUser = async (googleProfile: Profile): Promise<FMProfile> => {
    const URL: string = base_URL + API_ENDPOINTS.USERS;

    try {
        const response = await axios.post(URL, googleProfile);
        return response.data as FMProfile;
    } catch (error) {
        throw new Error('Error creating user: ' + error);
    }
};