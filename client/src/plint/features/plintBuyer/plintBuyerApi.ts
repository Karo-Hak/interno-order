import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';
import axios from 'axios';

type Tokened = { cookies: { access_token?: string } };
const authHeader = (t?: string) => (t ? { Authorization: `Bearer ${t}` } : {});

export interface PlintBuyerApiModel {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
  balanceAMD?: number;

  retailOrder?: any[];
  wholesaleOrder?: any[];
  debetKredit?: any[];

  buyRetail?: any[];
  buyWholesale?: any[];
  credit?: any[];
}

// CREATE
export const createPlintBuyer = createAsyncThunk(
  'plint-buyer/create',
  async (obj: Tokened & { buyer: { name: string; phone1?: string; phone2?: string; region?: string; address?: string } }, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/plint-buyer', obj.buyer, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create buyer failed' });
    }
  }
);


// UPDATE
export const updatePlintBuyer = createAsyncThunk(
  'plint-buyer/update',
  async (obj: Tokened & { id: string; dto: Partial<{ name: string; phone1: string; phone2: string; region: string; address: string }> }, { rejectWithValue }) => {
    try {
      const { data } = await http.patch(`/plint-buyer/${obj.id}`, obj.dto, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'update buyer failed' });
    }
  }
);

// REMOVE
export const removePlintBuyer = createAsyncThunk(
  'plint-buyer/remove',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.delete(`/plint-buyer/${obj.id}`, { headers: authHeader(obj.cookies.access_token) });
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'remove buyer failed' });
    }
  }
);

// LINK ORDER
export const linkPlintBuyerOrder = createAsyncThunk(
  'plint-buyer/link-order',
  async (obj: Tokened & { id: string; orderId: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(`/plint-buyer/${obj.id}/link-order`, { orderId: obj.orderId }, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'link order failed' });
    }
  }
);

// LINK DK
export const linkPlintBuyerDK = createAsyncThunk(
  'plint-buyer/link-dk',
  async (obj: Tokened & { id: string; dkId: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(`/plint-buyer/${obj.id}/link-dk`, { dkId: obj.dkId }, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'link dk failed' });
    }
  }
);


// GET /plint-buyer/wallet  -> ты на бэке сделаешь, чтобы вернул всех покупателей
export const allPlintBuyerThunk = createAsyncThunk(
  'plint-buyer/allWallet',
  async (cookies: { access_token?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/plint-buyer/wallet', {
        headers: cookies.access_token
          ? { Authorization: `Bearer ${cookies.access_token}` }
          : {},
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'failed to load plint buyers wallet' });
    }
  }
);

// список покупателей (лайт)
export const getPlintBuyers = createAsyncThunk(
  'plint-buyer/list',
  async (
    obj: Tokened & { q?: string; skip?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const { cookies, q, skip, limit } = obj;
      const { data } = await http.get('/plint-buyer', {
        headers: authHeader(cookies.access_token),
        params: { q, skip, limit },
      });
      // backend возвращает { items, total, ... }
      return data;
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data ?? { message: 'fetch plint buyers failed' }
      );
    }
  }
);

// детали одного покупателя (тяжелые массивы buyRetail/buyWholesale/credit)
export const getPlintBuyerById = createAsyncThunk(
  'plint-buyer/byId',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { cookies, id } = obj;
      const { data } = await http.get(`/plint-buyer/${id}`, {
        headers: authHeader(cookies.access_token),
      });
      return data as PlintBuyerApiModel;
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data ?? { message: 'fetch plint buyer failed' }
      );
    }
  }
);

export const deletePaymentByDateSum = createAsyncThunk(
  'plint-buyer/deleteByDateSum',
  async ({ cookies, buyerId, date, sum }: { cookies: any; buyerId: string; date: string; sum: number }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/plint-buyer/delete-by-date-sum`;
    const res = await axios.post(url, { buyerId, date, sum }, {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data as { deleted: boolean };
  }
);