export interface Languages {
    en: string;
    sv: string;
    fi: string;
}

export interface Booking {
    id: string;
    type: string;
    name: string;
    swc_number: string;
    date: string;
    time_from: string;
    time_to: string;
    equipment_id: string;
    user_id: string;
};

export interface BookingSearchParams {
    type?: string;
    name?: string;
    swc_number?: string;
    date?: string;
    time_from?: string;
    time_to?: string;
};