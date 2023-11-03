import axios, { AxiosRequestConfig } from "axios"
import { FMProfile, LoginCredentials, NewUser, Profile } from "../interfaces";
import authHeader from "./auth-header";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPOINTS = {
    USERS: '/users',
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    GOOGLE_SIGNIN: '/auth/google',
    USERS_ID: (id: string) => `${API_ENDPOINTS.USERS}/${id}`
}


export const signUp = async (signupform: NewUser) => {
    const URL: string = base_URL + API_ENDPOINTS.SIGNUP;
    try {
        const response = await axios.post(URL, signupform);
        return response;
    } catch (error) {
        throw new Error('Error signing up: ' + error);
    }
}

export const loginWithGoogle = async (code: any): Promise<any> => {
    const URL: string = base_URL + API_ENDPOINTS.GOOGLE_SIGNIN;
    try {
        const response = await axios.post(URL, { code });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) alert(error.response.data.message)
    }
}

export const loginWithCredentials = async (credentials: LoginCredentials): Promise<FMProfile> => {
    const URL = base_URL + API_ENDPOINTS.SIGNIN;
    try {
        const response = await axios.post(URL, credentials);
        return response.data;
    } catch (error) {
        throw new Error('Error signing in: ' + error);
    }
}

export const createUser = async (googleProfile: Profile): Promise<FMProfile> => {
    const URL: string = base_URL + API_ENDPOINTS.USERS;
    try {
        const response = await axios.post(URL, googleProfile);
        return response.data.user;
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


// GET USER BY ID (ADMIN)
export const getUserById = async (userId: string): Promise<FMProfile> => {
    const URL: string = base_URL + API_ENDPOINTS.USERS_ID(userId);
    try {
        const res = await axios.get(URL, { headers: authHeader() });
        return res.data as FMProfile;
    } catch (error) {
        throw new Error('Error getting user by id');
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