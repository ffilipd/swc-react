export interface Languages {
    en: string;
    sv: string;
    fi: string;
}


export interface NewUser {
    name: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    name: string;
    password: string;
}

export interface Booking {
    id?: string;
    date: string | undefined;
    time_from: string | undefined;
    time_to: string | undefined;
    equipment_number: string;
    equipment_name: string;
    equipmentId: string;
    user_name?: string;
};

export interface NewBooking {
    date: string | undefined;
    time_from: string | undefined;
    time_to: string | undefined;
    userId: string | undefined;
    equipmentId?: string;
};

export interface BookingSearchParams {
    userId?: string;
    equipment_type?: string;
    equipmentNameId?: string;
    equipmentId?: string;
    date?: string;
    time_from?: string;
    time_to?: string;
    usage?: 'booking' | 'report';
};

export interface ReportSearchParams {
    bookingId?: string;
    type?: string;
    equipment_name?: string;
    swc_number?: string;
    date?: string;
    user_id?: string;
    damage_type?: string;
};

export interface NewReport {
    bookingId: string | null;
    damageType: string;
    description?: string;
}

export interface Report {
    booking_id?: string;
    type?: string;
    equipment_name?: string;
    swc_number?: string;
    date?: string;
    user_id: string;
    notes?: string;
    damage_type: string;
}

export type FilterTargetType = "type" | "name" | "number";
export type EquipmentFilterResponse = string[] | { id: string, number: string }[] | { id: string, name: string }[]

export type Profile = {
    id: string;
    email: string;
    name: string;
};

export type Language = "en" | "sv" | "fi";
export type UserRole = "admin" | "user" | "viewer";
export type DamageType = 'none' | 'major' | 'minor' | 'other';

export interface FMProfile {
    id: string;
    email: string;
    verified_email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
    created_date: string;
    last_login: string;
    language: Language;
    role: UserRole;
}