export interface CartItem {
    id: string;
    type: "midi" | "pack";
    title: string;
    price: number;
}