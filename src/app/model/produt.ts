export interface Product {
    id?: string;
    brand: string;
    model: string;
    price: number;
    stock: number;
    imageUrl: string;
    description: string;
    categoryId: string;
}