import axios from "axios";
import authHeader from "./auth-header";
import { Equipment, EquipmentFilterResponse, EquipmentTree, NewEquipment } from "../interfaces";




interface EquipmentSearchParams {
    type?: string;
    equipmentName?: string;
    equipmentNumber?: string;
    equipmentNameId?: string;
    equipment_number?: string;
}

const base_URL: string = process.env.REACT_APP_API_URL || '';
const API_ENDPONTS = {
    EQUIPMENT: '/equipment',
    EQUIPMENT_TREE: '/equipment/tree',
    FILTERS: '/equipment/filters'
}

export async function getEquipment(_params?: EquipmentSearchParams): Promise<Equipment[]> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { headers: authHeader() });
        return res.data;
    } catch (error) {
        throw new Error('Error getting equipment' + error);
    }
};

export async function getEquipmentTree(userId: string): Promise<EquipmentTree> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT_TREE;
    try {
        const res = await axios.get(URL, { params: { userId: userId }, headers: authHeader() });
        return res.data;
    } catch (error) {
        throw new Error('Error getting equipment tree' + error);
    }
};


export async function getEquipmentFilters(_params?: EquipmentSearchParams): Promise<EquipmentFilterResponse> {
    const URL: string = base_URL + API_ENDPONTS.FILTERS;
    const params: URLSearchParams | undefined = _params && buildParams(_params);
    try {
        const res = await axios.get(URL, { params: params, headers: authHeader() });
        return res.data;
    } catch (error) {
        throw new Error('error getting equipment filters' + error);
    }
};

export async function addNewEquipment(NewEquipment: NewEquipment): Promise<void> {
    const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
    try {
        const res = await axios.post(URL, { ...NewEquipment }, { headers: authHeader() })
        return res.data.message;
    } catch (error) {
        throw new Error('Error adding new equipment: ' + error);
    }

}

// export async function editEquipment(NewEquipment: NewEquipment): Promise<void> {
//     const URL: string = base_URL + API_ENDPONTS.EQUIPMENT;
//     try {
//         const res = await axios.post(URL, { ...NewEquipment }, { headers: authHeader() })
//         return res.data.message;
//     } catch (error) {
//         throw new Error('Error adding new equipment: ' + error);
//     }

// }


/******* BUILD PARAMETERS *******/
function buildParams(options: EquipmentSearchParams): URLSearchParams {
    // add parameters to the url
    let params = new URLSearchParams();
    const allowedParams: (keyof EquipmentSearchParams)[] = ['equipmentNameId', 'equipment_number', 'type'];

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