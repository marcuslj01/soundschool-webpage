// For adding to firestore
export interface MidiInput {
    name: string;
    price: number;
    key: string;
    bpm: number;
    genre: string;
    scale?: string;
    vst: string;
    preset: string;
    file_url: string;
    preview_url: string;
    tags?: string[];
    hidden: boolean;
    discount_price?: number;
    is_featured?: boolean;
};

// For fetching from firestore (created_at is added in the addMidi function)
export interface Midi extends MidiInput {
    id: string;
    created_at: Date;
};