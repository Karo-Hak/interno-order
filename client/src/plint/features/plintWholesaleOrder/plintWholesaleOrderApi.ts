// features/plintWholesaleOrder/plintWholesaleOrderApi.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';

const PATH = {
  wholesale: '/plint-wholesale-order',
};

type Tokened = { cookies: { access_token?: string } };
const auth = (t?: string) => (t ? { Authorization: `Bearer ${t}` } : {});
const withAuth = (t?: string) => ({ headers: auth(t) });

// ---- Types (минимально под бэк) ----
export type WholesaleItem = {
  name?: string;
  sku?: string;
  qty: number;
  price: number;
  sum: number;
};

export type CreatePlintWholesaleOrderDto = {
  buyer: string;               // buyerId
  items: WholesaleItem[];
  date?: string;               // ISO
  buyerComment?: string;
  paymentMethod?: string;
  delivery?: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliverySum?: number;
  prepayment?: number;
  // опционально, если на фронте передаёшь:
  agent?: string;
  agentDiscount?: number;
  agentSum?: number;
};

export type UpdatePlintWholesaleOrderDto = Partial<CreatePlintWholesaleOrderDto>;

// ---- CREATE ----
export const createPlintWholesaleOrder = createAsyncThunk(
  'plint-wholesale-order/create',
  async (obj: Tokened & { dto: CreatePlintWholesaleOrderDto }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(PATH.wholesale, obj.dto, withAuth(obj.cookies.access_token));
      return data; // { _id, ...order }
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create wholesale order failed' });
    }
  }
);

// ---- GET BY ID ----
export const getPlintWholesaleOrderById = createAsyncThunk(
  'plint-wholesale-order/getById',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`${PATH.wholesale}/${obj.id}`, withAuth(obj.cookies.access_token));
      return data; // полный заказ
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch wholesale order failed' });
    }
  }
);

// ---- LIST BY BUYER ----
export const listPlintWholesaleOrdersByBuyer = createAsyncThunk(
  'plint-wholesale-order/listByBuyer',
  async (obj: Tokened & { buyerId: string; limit?: number }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(PATH.wholesale, {
        ...withAuth(obj.cookies.access_token),
        params: { buyerId: obj.buyerId, limit: obj.limit ?? 100 },
      });
      return data; // массив заказов
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch wholesale orders by buyer failed' });
    }
  }
);

// ---- UPDATE ----
export const updatePlintWholesaleOrder = createAsyncThunk(
  'plint-wholesale-order/update',
  async (obj: Tokened & { id: string; dto: UpdatePlintWholesaleOrderDto }, { rejectWithValue }) => {
    try {
      const { data } = await http.patch(`${PATH.wholesale}/${obj.id}`, obj.dto, withAuth(obj.cookies.access_token));
      return { ...data, id: obj.id }; // { ok: true, id }
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'update wholesale order failed' });
    }
  }
);

// ---- ADD PAYMENT (поддержаны оба эндпоинта, выбирай один) ----

// legacy: POST /:id/payment  { amount, date? }
export const addPlintWholesaleOrderPaymentLegacy = createAsyncThunk(
  'plint-wholesale-order/addPaymentLegacy',
  async (obj: Tokened & { id: string; amount: number; date?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(
        `${PATH.wholesale}/${obj.id}/payment`,
        { amount: obj.amount, date: obj.date },
        withAuth(obj.cookies.access_token)
      );
      return { ...data, id: obj.id }; // { ok, newBalance, ... }
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'add payment failed' });
    }
  }
);

// рекомендуемый: POST /:id/payments  { amount, date?, userId? }
export const addPlintWholesaleOrderPayment = createAsyncThunk(
  'plint-wholesale-order/addPayment',
  async (obj: Tokened & { id: string; amount: number; date?: string; userId?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(
        `${PATH.wholesale}/${obj.id}/payments`,
        { amount: obj.amount, date: obj.date, userId: obj.userId },
        withAuth(obj.cookies.access_token)
      );
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'add payment failed' });
    }
  }
);

// ---- MONTHLY REPORT ----
export const fetchPlintMonthlyReportWholesale = createAsyncThunk(
  'plint-wholesale-order/monthlyReport',
  async (obj: Tokened & { month: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get(`${PATH.wholesale}/report/monthly`, {
        ...withAuth(obj.cookies.access_token),
        params: { month: obj.month }, // 'YYYY-MM'
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'report fetch failed' });
    }
  }
);

// ---- DELETE ----
export const deletePlintWholesaleOrderById = createAsyncThunk(
  'plint-wholesale-order/delete',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.delete(`${PATH.wholesale}/${obj.id}`, withAuth(obj.cookies.access_token));
      return data; // { ok: true }
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'delete wholesale order failed' });
    }
  }
);

/**
 * Агентский платёж, привязанный к заказу.
 * Бэк ожидает: POST /plint-wholesale-order/:id/agent-payments  { amount, date?, userId }
 */
export const addPlintAgentPayment = createAsyncThunk(
  'plint-wholesale-order/addAgentPayment',
  async (
    obj: Tokened & {
      orderId: string;     // обязательный: id wholesale-заказа
      amount: number;      // обязательный: сумма платежа
      date?: string;       // опционально: ISO datetime
      userId?: string;     // опционально: кто провёл платёж
      // agentId?/buyerId? — не требуются сервером для этого роута
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await http.post(
        `/plint-wholesale-order/${obj.orderId}/agent-payments`,
        {
          amount: obj.amount,
          date: obj.date,
          userId: obj.userId,
        },
        withAuth(obj.cookies.access_token)
      );
      // сервер возвращает { ok: true, newAgentBalance? }
      return { ...data, orderId: obj.orderId };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'agent payment failed' });
    }
  }
);