import axios from "axios";
import { Booking, BookingSearchParams } from "../interfaces";

export const getBookings = async (): Promise<Booking[] | undefined> => {
    try {
        const res = await axios.get('https://192.168.132.129:8000/bookings');
        return res.data as Booking[];
    } catch (error) {
        console.log(error);
    }
}