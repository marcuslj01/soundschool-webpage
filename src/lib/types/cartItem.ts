export interface CartItem {
    id: string;
    type: "midi" | "pack" | "flp";
    title: string;
    price: number;
    discount_price?: number;
    is_discounted?: boolean;
}