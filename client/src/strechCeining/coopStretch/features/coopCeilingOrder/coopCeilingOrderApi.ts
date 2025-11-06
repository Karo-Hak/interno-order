import axios, { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_SERVER_URL!;
const authHeader = (cookies: any) => ({
  Authorization: `Bearer ${cookies?.access_token ?? ''}`,
});

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';


export type GroupedItem = {
  name: string;
  qty: number;
  price: number;
  sum: number;
};
export type TextureItemDto = {
  name: string;
  height?: number;
  width?: number;
  qty: number;
  price: number;
  sum: number;
};

export type StretchTextureOrderDto = {
  groupedStretchTextureData: TextureItemDto[];
  groupedStretchProfilData: GroupedItem[];
  groupedLightPlatformData: GroupedItem[];
  groupedLightRingData: GroupedItem[];
  date?: string;
  buyerComment?: string;
  balance: number;
  paymentMethod: PaymentMethod;
  picUrl: string[];
};

export type BuyerInputDto = {
  buyerId?: string;
  name?: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
};

export type CreateCoopOrderDto = {
  stretchTextureOrder: StretchTextureOrderDto;
  buyer:
    | { buyerId?: string }
    | { name: string; phone1?: string; phone2?: string; region?: string; address?: string };
  userId: string;
};

export type UpdateCoopOrderDto = Partial<
  StretchTextureOrderDto & {
    buyerId: string;
    userId: string;
  }
>;

export type CoopCeilingOrderModel = {
  _id: string;
  groupedStretchTextureData: GroupedItem[];
  groupedStretchProfilData: GroupedItem[];
  groupedLightPlatformData: GroupedItem[];
  groupedLightRingData: GroupedItem[];
  date: string;
  buyerComment: string;
  balance: number;
  paymentMethod: PaymentMethod;
  picUrl: string[];
  buyer: any; // может прийти популяченный объект; если нужно — сузьте до string
  user: any;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiError = { message: string };

// helpers
const toApiError = (e: unknown, fallback = 'Request failed'): ApiError => {
  const ax = e as AxiosError<any>;
  const msg =
    ax?.response?.data?.message ??
    ax?.message ??
    (typeof e === 'string' ? e : null) ??
    fallback;
  return { message: String(msg) };
};

/* ========== THUNKS (с rejectWithValue) ========== */

export const createCoopOrder = createAsyncThunk<
  { message: string; orderId: string },
  { cookies: any; payload: CreateCoopOrderDto },
  { rejectValue: ApiError }
>('coopCeilingOrder/create', async ({ cookies, payload }, thunkAPI) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/coop-ceiling-order`,
      payload,
      { headers: authHeader(cookies) }
    );
    return data; // { message, orderId }
  } catch (e) {
    return thunkAPI.rejectWithValue(toApiError(e, 'Failed to create order'));
  }
});

export const listCoopOrders = createAsyncThunk<
  CoopCeilingOrderModel[],
  { cookies: any; startDate: string; endDate: string },
  { rejectValue: ApiError }
>('coopCeilingOrder/list', async ({ cookies, startDate, endDate }, thunkAPI) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/coop-ceiling-order/list`,
      {
        headers: authHeader(cookies),
        params: { startDate, endDate },
      }
    );
    return data as CoopCeilingOrderModel[];
  } catch (e) {
    return thunkAPI.rejectWithValue(toApiError(e, 'Failed to fetch orders'));
  }
});

export const getCoopOrder = createAsyncThunk<
  { order: CoopCeilingOrderModel },
  { cookies: any; id: string },
  { rejectValue: ApiError }
>('coopCeilingOrder/getOne', async ({ cookies, id }, thunkAPI) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/coop-ceiling-order/findCoopStretchOrder/${id}`,
      { headers: authHeader(cookies) }
    );
    return data as { order: CoopCeilingOrderModel };
  } catch (e) {
    return thunkAPI.rejectWithValue(toApiError(e, 'Failed to fetch order'));
  }
});

export const updateCoopOrder = createAsyncThunk<
  { message: string; order: CoopCeilingOrderModel },
  { cookies: any; id: string; patch: UpdateCoopOrderDto },
  { rejectValue: ApiError }
>('coopCeilingOrder/update', async ({ cookies, id, patch }, thunkAPI) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/coop-ceiling-order/${id}/update`,
      patch,
      { headers: authHeader(cookies) }
    );
    return data as { message: string; order: CoopCeilingOrderModel };
  } catch (e) {
    return thunkAPI.rejectWithValue(toApiError(e, 'Failed to update order'));
  }
});

export const deleteCoopOrder = createAsyncThunk<
  { message: string },
  { cookies: any; id: string },
  { rejectValue: ApiError }
>('coopCeilingOrder/delete', async ({ cookies, id }, thunkAPI) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/coop-ceiling-order/${id}/delete`,
      {},
      { headers: authHeader(cookies) }
    );
    return data as { message: string };
  } catch (e) {
    return thunkAPI.rejectWithValue(toApiError(e, 'Failed to delete order'));
  }
});
export const fetchCoopMonthlyReport = createAsyncThunk(
  'coopOrder/reportMonthly',
  async (obj: { cookies: any; month?: string }) => {
    const { cookies, month } = obj;
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-ceiling-order/report/monthly`;
    const response = await axios.get(url, {
      params: month ? { month } : undefined,
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    });
    return response.data as {
      rows: { _id: string; date: string; buyerName?: string; buyerPhone?: string; sum: number }[];
      total: number;
      count: number;
      month: string;
    };
  }
);

export const fetchCoopOrderById = createAsyncThunk(
  'coopOrder/byId',
  async (obj: { cookies: any; id: string }) => {
    const { cookies, id } = obj;
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-ceiling-order/findCoopStretchOrder/${id}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    // контроллер возвращает { order }
    return res.data.order;
  }
);

export const deleteCoopOrderById = createAsyncThunk(
  'coopOrder/delete',
  async ({ cookies, id }: { cookies: any; id: string }) => {
    const res = await axios.delete(
      `${process.env.REACT_APP_SERVER_URL}/coop-ceiling-order/${id}`,
      { headers: { Authorization: `Bearer ${cookies.access_token}` } }
    );
    return res.data;
  }
);

export const fetchCoopOrdersByDateRange = createAsyncThunk(
  'coopOrder/listByRange',
  async ({ cookies, startDate, endDate }: { cookies: any; startDate: string; endDate: string }) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/coop-ceiling-order/list`,
        {
          params: { startDate, endDate },
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      );
      return res.data;
    } catch (e: any) {
      return { error: e?.response?.data?.message || 'not found' };
    }
  }
);