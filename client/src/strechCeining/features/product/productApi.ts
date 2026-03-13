import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type Reject = { message: string };

type ProductByCatResponse<T = any> = {
  items: T[];
  total: number;
  skip: number;
  limit: number;
};

export type BuyItem = {
  productId: string; 
  qty: number;      
};

export type BuyPayload = {
  items: BuyItem[];
  date?: string;    
};

export type BuyResponse = { ok: boolean };

const baseUrl = () => String(process.env.REACT_APP_SERVER_URL ?? "").replace(/\/$/, "");

// ✅ Добавление продукта
export const addProduct = createAsyncThunk<any, { product: any; cookies: any }, { rejectValue: Reject }>(
  "product/add",
  async ({ product, cookies }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${baseUrl()}/product`,
        product,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token ?? ""}` },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка добавления продукта";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);

export const updateProductsLists = createAsyncThunk<any, { updatedProductLists: any; cookies: any }, { rejectValue: Reject }>(
  "product/updateProductsLists",
  async ({ updatedProductLists, cookies }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${baseUrl()}/product/updateQuantity`,
        updatedProductLists,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token ?? ""}` },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка обновления списка";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);

export const getAllProduct = createAsyncThunk<any, any, { rejectValue: Reject }>(
  "product/getAll",
  async (cookies, thunkAPI) => {
    try {
      const { data } = await axios.get(
        `${baseUrl()}/product/allProduct`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token ?? ""}` },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка получения товаров";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);

export const getProductsByCategory = createAsyncThunk<
  ProductByCatResponse,
  { cookies: any; categoryId: string; q?: string },
  { rejectValue: Reject }
>(
  "product/byCategory",
  async ({ cookies, categoryId, q }, thunkAPI) => {
    try {
      const { data } = await axios.get<ProductByCatResponse>(
        `${baseUrl()}/product/by-category`,
        {
          headers: { Authorization: `Bearer ${cookies?.access_token ?? ""}` },
          params: { categoryId, q },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка выборки по категории";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);

export const buyProducts = createAsyncThunk<
  BuyResponse,
  { cookies: any; body: BuyPayload },
  { rejectValue: Reject }
>(
  "stock/buy",
  async ({ cookies, body }, thunkAPI) => {
    try {
      const { data } = await axios.post<BuyResponse>(
        `${baseUrl()}/product/buy`,
        body,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token ?? ""}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка оформления закупки";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);

export const updateProduct = createAsyncThunk<
  any,
  {
    cookies: any;
    payload: {
      id: string;
      quantity?: number;
      price?: number;
      coopPrice?: number;
      name?: string;
      categoryProduct?: string;
    };
  },
  { rejectValue: Reject }
>(
  "product/updateOne",
  async ({ cookies, payload }, thunkAPI) => {
    try {
      const { id, ...patch } = payload;

      const { data } = await axios.patch(
        `${baseUrl()}/product/${id}`,
        patch,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token ?? ""}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Ошибка обновления продукта";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
  
);

export const getProductsByCategoryApi = async (
  categoryId: string,
  token: string,
  q?: string
): Promise<ProductByCatResponse> => {
  const { data } = await axios.get<ProductByCatResponse>(
    `${baseUrl()}/product/by-category`,
    {
      headers: { Authorization: `Bearer ${token ?? ""}` },
      params: { categoryId, q },
    }
  );

  return data;
};
