import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProduct, getAllProduct, updateProductsLists } from "./productApi";

export interface Product {
  _id: string;
  name: string;
  price: number;
  coopPrice: number;
  quantity: number;
}

export interface ProductState {
  arrProduct: Product[];
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
        // ✅ сервер возвращает { product: [...] }
        if (Array.isArray(action.payload)) {
          state.arrProduct = action.payload;
        } else if (Array.isArray(action.payload?.product)) {
          state.arrProduct = action.payload.product;
        }
      })
      .addCase(updateProductsLists.fulfilled, (state, action) => {
        // ✅ Обновляем локальное состояние если пришли товары
        if (Array.isArray(action.payload)) {
          state.arrProduct = action.payload;
        } else if (Array.isArray(action.payload?.product)) {
          state.arrProduct = action.payload.product;
        }
      });
  },
});

export const selectProduct = (state: { product: ProductState }) => state.product;
export default productSlice.reducer;
