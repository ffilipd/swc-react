import axios, { AxiosRequestConfig } from "axios"
import { FMProfile, Profile } from "../interfaces";
import { useUser } from "../UserContext";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPOINTS = {
    USERS: '/users',
    USERS_ID: (id: string) => `${API_ENDPOINTS.USERS}/${id}`
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

// UPDATE USER PROFILE
export const updateUserProfile = async (profile: FMProfile): Promise<FMProfile> => {
    const prefillParams: (keyof FMProfile)[] = ['language', 'role'];
    for (const key of prefillParams) {
        if (!profile[key] && key === 'language') profile[key] = 'en';
        if (!profile[key] && key === 'role') profile[key] = 'viewer';
    }

    const request = await buildRequestConfig({ method: 'PUT', data: profile, id: profile.id })
    try {
        const response = await axios(request);
        return response.data as FMProfile;
    } catch (error) {
        throw new Error('Error creating user: ' + error);
    }
}

async function buildRequestConfig(params: { id?: string, data?: FMProfile, method: string }): Promise<AxiosRequestConfig> {
    const { id, data, method } = params
    return {
        method: method,
        url: base_URL + (id ? API_ENDPOINTS.USERS_ID(id) : API_ENDPOINTS.USERS),
        // headers: {
        //     Authorization: await requestToken(),
        //     setContentType: 'application/json',
        //     Accept: 'application/json'
        // },
        data: data || undefined,
        // params: filterParams !== undefined ? buildParams(filterParams) : undefined
    }
}