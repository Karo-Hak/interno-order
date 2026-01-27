// src/strechCeining/stock/features/product/productSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addProduct, getAllProduct, updateProductsLists, updateProduct } from "./productApi";

export interface Product {
  _id: string;
  name: string;
  price: number;
  coopPrice: number;
  quantity: number;
}

export interface ProductState {
  arrProduct: Product[];
  product: Product | null;
  loading: boolean;
  error?: string;
}

export const initialState: ProductState = {
  arrProduct: [],
  product: null,
  loading: false,
  error: undefined,
};

const pickArray = (payload: any): Product[] => {
  // сервер может вернуть Product[] или {product: Product[]} или {items: Product[]}
  if (Array.isArray(payload)) return payload as Product[];
  if (Array.isArray(payload?.product)) return payload.product as Product[];
  if (Array.isArray(payload?.items)) return payload.items as Product[];
  return [];
};

const pickOne = (payload: any): Product | null => {
  // сервер может вернуть Product или {product: Product}
  if (payload && typeof payload === "object") {
    if (payload._id) return payload as Product;
    if (payload.product && payload.product._id) return payload.product as Product;
  }
  return null;
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // -------- addProduct --------
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const one = pickOne(action.payload);
        if (one) state.product = one;
      })
      .addCase(addProduct.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Ошибка addProduct";
      })

      // -------- getAllProduct --------
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.arrProduct = pickArray(action.payload);
      })
      .addCase(getAllProduct.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Ошибка getAllProduct";
      })

      // -------- updateProductsLists (old) --------
      .addCase(updateProductsLists.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateProductsLists.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const arr = pickArray(action.payload);
        if (arr.length) state.arrProduct = arr;
      })
      .addCase(updateProductsLists.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Ошибка updateProductsLists";
      })

      // -------- updateProduct (one) --------
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        // 1) если сервер вернул список — заменим
        const arr = pickArray(action.payload);
        if (arr.length) {
          state.arrProduct = arr;
          return;
        }

        // 2) если вернул один продукт — обновим его в массиве
        const one = pickOne(action.payload);
        if (one?._id) {
          state.product = one;
          const idx = state.arrProduct.findIndex((p) => p._id === one._id);
          if (idx >= 0) state.arrProduct[idx] = { ...state.arrProduct[idx], ...one };
        }
        // 3) если вернул {ok:true} — ничего не делаем (UI обновляй через getAllProduct)
      })
      .addCase(updateProduct.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Ошибка updateProduct";
      });
  },
});

export const selectProduct = (state: { product: ProductState }) => state.product;
export default productSlice.reducer;
