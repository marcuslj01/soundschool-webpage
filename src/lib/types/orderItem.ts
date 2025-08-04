export interface OrderItem {
    id: string;
    type: "midi" | "pack";
    title: string;
    price: number;
    originalPrice?: number | null;
    isDiscounted?: boolean;
    previewUrl: string;
    downloadUrl: string;
}