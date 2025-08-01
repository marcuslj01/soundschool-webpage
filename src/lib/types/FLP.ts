export interface FLPInput {
    file_url: string;
    image_url: string;
    video_url: string;
    description: string;
    name: string;
    price: number;
    root: string;
    scale: string;
    bpm: number;
    genre: string;
    tags?: string[];
    hidden: boolean;
    is_featured?: boolean;
    is_discounted?: boolean;
    discount_price?: number;
    sales?: number;
};

export interface FLP extends FLPInput {
    id: string;
    created_at: Date;
};