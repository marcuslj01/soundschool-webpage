// Interface for a pack of midi files or samples
export interface PackInput {
    name: string;
    type: "midi" | "sample" | null;
    description: string;
    price: number;
    discount_price: number;
    genre?: string;
    file_count: number;
    download_url: string; // URL to download the pack ZIP file
    preview_url: string; // URL to preview the pack (mp3)
    image_url: string; // URL to the image of the pack
    tags: string[];
    hidden: boolean;
    is_featured: boolean;
    is_discounted: boolean;
    sales: number;
}

export interface Pack extends PackInput {
    id: string;
    created_at: Date;
}