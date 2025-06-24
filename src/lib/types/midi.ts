// For adding to firestore
export interface MidiInput {
    file_url: string;
    preview_url: string;
    name: string;
    price: number;
    key: string;
    scale: string;
    bpm: number;
    genre: string;
    vst: string;
    preset: string;
    tags?: string[];
    hidden: boolean;
    is_featured?: boolean;
    is_discounted?: boolean;
    discount_price?: number;
};

// For fetching from firestore (created_at is added in the addMidi function)
export interface Midi extends MidiInput {
    id: string;
    created_at: Date;
};