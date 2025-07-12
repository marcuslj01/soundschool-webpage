export interface OrderItem {
    id: string;
    type: "midi" | "pack";
    title: string;
    price: number;
    previewUrl: string;
    downloadUrl: string;
}