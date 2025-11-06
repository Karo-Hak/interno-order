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
  productId: string; // _id товара
  qty: number;       // на сколько увеличить остаток
};

export type BuyPayload = {
  items: BuyItem[];
  date?: string;     // ISO строка (опционально)
};

export type BuyResponse = {
  ok: boolean;
  // можно расширить под ответ бэка
};


export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => resolve(res.data))
      .catch((e) => reject(e));
  });
};




// ✅ Добавление продукта
export const addProduct = createAsyncThunk(
  "product/axios",
  async (obj: any) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/product",
        obj.product,
        {
          headers: {
            Authorization: `Bearer ${obj.cookies.access_token}`,
          },
        }
      );

      return response.data;
    } catch (e) {
      return { error: "not found" };
    }
  }
);

// ✅ Обновление списка товаров
export const updateProductsLists = createAsyncThunk(
  "product/updateProductsLists/axios",
  async (obj: any, thunkAPI) => {
    try {
      // ⚠️ Отправляем массив напрямую, не распыляем его
      const response = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/product/updateQuantity",
        obj.updatedProductLists,
        {
          headers: {
            Authorization: `Bearer ${obj.cookies.access_token}`,
          },
        }
      );

      // ✅ Возвращаем данные
      return response.data;
    } catch (e: any) {
      console.error("Ошибка updateProductsLists:", e);
      return thunkAPI.rejectWithValue(e?.message || "Ошибка обновления");
    }
  }
);

// ✅ Получение всех товаров
export const getAllProduct = createAsyncThunk(
  "product/allProduct/axios",
  async (cookie: any, thunkAPI) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_SERVER_URL + "/product/allProduct",
        {
          headers: {
            Authorization: `Bearer ${cookie.access_token}`,
          },
        }
      );
      return response.data;
    } catch (e: any) {
      console.error("Ошибка getAllProduct:", e);
      return thunkAPI.rejectWithValue(e?.message || "Ошибка получения товаров");
    }
  });

export const getProductsByCategory = createAsyncThunk<
  ProductByCatResponse, // что вернёт fulfilled
  { cookies: any; categoryId: string; q?: string;  }, // аргументы
  { rejectValue: Reject } // что вернёт rejectWithValue
>(
  "product/byCategory",
  async ({ cookies, categoryId, q}, thunkAPI) => {
    try {
      const { data } = await axios.get<ProductByCatResponse>(
        `${process.env.REACT_APP_SERVER_URL}/product/by-category`,
        {
          headers: {
            Authorization: `Bearer ${cookies?.access_token ?? ""}`,
          },
          params: { categoryId, q },
        }
      );
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Ошибка выборки по категории";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }

);

export const buyProducts = createAsyncThunk<
  BuyResponse,                              // fulfilled
  { cookies: any; body: BuyPayload },       // arg
  { rejectValue: Reject }                   // rejectWithValue
>(
  "stock/buy",
  async ({ cookies, body }, thunkAPI) => {
    try {
      const { data } = await axios.post<BuyResponse>(
        `${process.env.REACT_APP_SERVER_URL}/product/buy`,
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
        e?.message ||
        "Ошибка оформления закупки";
      return thunkAPI.rejectWithValue({ message: String(msg) });
    }
  }
);