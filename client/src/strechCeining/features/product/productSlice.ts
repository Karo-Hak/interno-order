import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProduct, getAllProduct } from "./productApi";

export interface Product {
    _id: number;
    name: string;
    quantity: number;
}

export interface ProductState {
    arrProduct: Array<Product>;
    product: Product;
}

export const initialState: ProductState = {
    arrProduct: [],
    product: {} as Product,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.product = action.payload;
            })
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.arrProduct = action.payload.product;
            });
    },
});

export const selectProduct = (state: { product: ProductState }) => state.product;

export default productSlice.reducer;
