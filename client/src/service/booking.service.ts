import { Booking, BookingSearchParams } from "../interfaces";

// export const getBookings = () => {
//     return bookings;
// }


// export const getBookingsByDate = (date: any): Booking[] => {
//     return bookings.filter(booking => booking.date === date);
// }

// export const getBookingsByParams = (params: BookingSearchParams): Booking[] => {
//     const { type, name, swc_number, date, time_from, time_to } = params;
//     const filteredBookings = bookings.filter(booking => {
//         return booking.type === type ||
//             booking.date === date ||
//             booking.swc_number === swc_number ||
//             booking.name === name;
//     })
//     return filteredBookings;
// }


// // export const getNumbersByTypeAndName = (targetType: string, targetName: string): string[] => {
// //     const matchingNumbers: string[] = [];
// //     // Loop through the equipment object and add numbers of the specified type and name to the array
// //     for (const key in equipment) {
// //         if (equipment.hasOwnProperty(key)) {
// //             const equipmentItem = equipment[key];
// //             if (equipmentItem.type === targetType && equipmentItem.name === targetName) {
// //                 matchingNumbers.push(equipmentItem.swc_number);
// //             }
// //         }
// //     }

// //     return matchingNumbers;
// // }