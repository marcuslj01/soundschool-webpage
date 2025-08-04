export interface OrderItem {
    id: string;
    type: "midi" | "pack" | "flp";
    title: string;
    price: number;
    originalPrice?: number | null;
    isDiscounted?: boolean;
    previewUrl: string;
    downloadUrl: string;
}