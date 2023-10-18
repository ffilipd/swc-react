export interface Languages {
    en: string;
    sv: string;
    fi: string;
}

export interface Booking {
    id?: string;
    type: string
    equipment_name: string;
    swc_number: string;
    date: string | undefined;
    time_from: string | undefined;
    time_to: string | undefined;
    equipment_id?: string;
    user_id: string;
};

export interface BookingSearchParams {
    type?: string;
    equipment_name?: string;
    swc_number?: string;
    date?: string;
    time_from?: string;
    time_to?: string;
};

export type FilterTargetType = "type" | "name" | "number";