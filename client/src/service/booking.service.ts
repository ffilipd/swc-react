import axios from "axios";
import { Booking, BookingSearchParams } from "../interfaces";

const base_URL: string = process.env.REACT_APP_API_URL2 || '';
const API_ENDPONTS = {
    BOOKINGS: '/bookings',
}

export const getBookings = async (_params?: BookingSearchParams): Promise<Booking[]> => {
    const URL: string = base_URL + API_ENDPONTS.BOOKINGS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params });
        return res.data;
    } catch (error) {
        throw new Error('error getting bookings' + error)
    }
}

/******* BUILD PARAMETERS *******/
function buildParams(options: BookingSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof BookingSearchParams)[] = ['equipment_name', 'swc_number', 'type', 'date', 'time_from', 'time_to'];

    // Loop through parameters
    for (const key of allowedParams) {
        const optionValue = options[key];
        // If parameter is specified
        if (optionValue !== undefined && optionValue !== null) {
            // If multiple values in parameter, join then with '_'
            const paramValue = Array.isArray(optionValue) ? optionValue.join('_') : optionValue;
            // Append paramter to request
            params.append(String(key), paramValue.toString());
        }
    }
    return params;
}