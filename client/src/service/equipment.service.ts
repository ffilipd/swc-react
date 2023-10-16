import axios from "axios";
import { FilterTargetType } from "../interfaces";


interface Equipment {
    [key: string]: {
        type: string;
        equipment_name: string;
        swc_number: string;
        size?: string; // Optional property for windsurfing boards and sails
    };
}

interface EquipmentSearchParams {
    type?: string;
    equipment_name?: string;
    swc_number?: string;
}

export async function getEquipment(params?: EquipmentSearchParams): Promise<Equipment[] | undefined> {
    try {
        const res = await axios.get('http://192.168.132.129:8000/equipment');
        return res.data as Equipment[];
    } catch (error) {
        console.log(error);
    }
};