import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';

/** ===== DRY: пути и хедеры ===== */
const PATHS = {
  retailBase: '/plint-retail-order',
};

type Tokened = { cookies: { access_token?: string } };
const authHeader = (t?: string) => (t ? { Authorization: `Bearer ${t}` } : {});
const withAuth = (t?: string) => ({ headers: authHeader(t) });

/** ===== Types ===== */
export type RetailItem = {
  name?: string;
  sku?: string;
  qty: number;
  price: number;
  sum: number;
};

export type CreatePlintRetailOrderDto = {
  buyer: string;               // buyerId
  items: RetailItem[];
  date?: string;               // ISO
  buyerComment?: string;
  paymentMethod?: string;
  delivery?: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliverySum?: number;
  prepayment?: number;
};

export type UpdatePlintRetailOrderDto = Partial<CreatePlintRetailOrderDto>;

/** ===== CREATE ===== */
export const createPlintRetailOrder = createAsyncThunk(
  'plint-retail-order/create',
  async (obj: Tokened & { dto: CreatePlintRetailOrderDto }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(PATHS.retailBase, obj.dto, withAuth(obj.cookies.access_token));
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create retail order failed' });
    }
  }
);

/** ===== GET BY ID ===== */
export const getPlintRetailOrderById = createAsyncThunk(
  'plint-retail-order/getById',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`${PATHS.retailBase}/${obj.id}`, withAuth(obj.cookies.access_token));
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch retail order failed' });
    }
  }
);

/** ===== LIST BY BUYER ===== */
export const listPlintRetailOrdersByBuyer = createAsyncThunk(
  'plint-retail-order/listByBuyer',
  async (obj: Tokened & { buyerId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(PATHS.retailBase, {
        ...withAuth(obj.cookies.access_token),
        params: { buyerId: obj.buyerId, limit: obj.limit ?? 100 },
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch retail orders by buyer failed' });
    }
  }
);

/** ===== UPDATE ===== */
export const updatePlintRetailOrder = createAsyncThunk(
  'plint-retail-order/update',
  async (obj: Tokened & { id: string; dto: UpdatePlintRetailOrderDto }, { rejectWithValue }) => {
    try {
      const { data } = await http.patch(`${PATHS.retailBase}/${obj.id}`, obj.dto, withAuth(obj.cookies.access_token));
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'update retail order failed' });
    }
  }
);

/** ===== ADD PAYMENT (оба варианта как у тебя) ===== */
export const addPlintRetailOrderPayment = createAsyncThunk(
  'plint-retail-order/addPayment',
  async (obj: Tokened & { id: string; amount: number; date?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(
        `${PATHS.retailBase}/${obj.id}/payment`,
        { amount: obj.amount, date: obj.date },
        withAuth(obj.cookies.access_token)
      );
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'add payment failed' });
    }
  }
);

export const addPlintOrderPayment = createAsyncThunk(
  'plint-retail-order/addPaymentV2',
  async (obj: Tokened & { id: string; amount: number; date?: string; userId?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(
        `${PATHS.retailBase}/${obj.id}/payments`,
        { amount: obj.amount, date: obj.date, userId: obj.userId },
        withAuth(obj.cookies.access_token)
      );
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'add payment failed' });
    }
  }
);

/** ===== MONTHLY REPORT (Retail) ===== */
export const fetchPlintMonthlyReportRetail = createAsyncThunk(
  'plint-retail-order/monthlyReport',
  async (obj: Tokened & { month: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`${PATHS.retailBase}/report/monthly`, {
        ...withAuth(obj.cookies.access_token),
        params: { month: obj.month },
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'report fetch failed' });
    }
  }
);

/** ===== ALIASES (совместимость с текущими импортами) ===== */
export const fetchPlintOrderById = getPlintRetailOrderById;

export const deletePlintOrderById = createAsyncThunk(
  'plint-retail-order/delete',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.delete(`${PATHS.retailBase}/${obj.id}`, withAuth(obj.cookies.access_token));
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'delete order failed' });
    }
  }
);
