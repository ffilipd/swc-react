import axios from "axios";
import { Report, ReportSearchParams } from "../interfaces";

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPONTS = {
    REPORTS: '/report',
}

export const getReports = async (_params?: ReportSearchParams): Promise<Report[]> => {
    const URL: string = base_URL + API_ENDPONTS.REPORTS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params });
        return res.data;
    } catch (error) {
        throw new Error('error getting bookings' + error)
    }
}

export const addReport = async (newReport: Report): Promise<void> => {
    const URL: string = base_URL + API_ENDPONTS.REPORTS;
    try {
        await axios.post(URL, { ...newReport })
    } catch (error) {
        throw new Error('Error adding new booking: ' + error)
    }
}

/******* BUILD PARAMETERS *******/
function buildParams(options: ReportSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof ReportSearchParams)[] = ['equipment_name', 'swc_number', 'type', 'date', 'bookingId', 'damage_type', 'user_id'];

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