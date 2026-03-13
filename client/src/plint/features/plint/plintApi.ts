import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';

type Tokened = { cookies: { access_token?: string } }; 

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const addNewPlint = createAsyncThunk(
  '/plint-products/create',
  async (
    obj: Tokened & {
      plint: { name: string; retailPriceAMD: number; wholesalePriceAMD: number; stockBalance: number };
    },
    { rejectWithValue }
  ) => {
    try {
      if (!obj.cookies?.access_token) return rejectWithValue({ message: 'No token' });
      const { data } = await http.post('/plint-products', obj.plint, {
        headers: authHeader(obj.cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create failed' });
    }
  }
);

export const updatePlintPrice = createAsyncThunk(
  'plint-products/updatePrice',
  async (
    obj: Tokened & { plint: { _id: string; retailPriceAMD: number; wholesalePriceAMD: number } },
    { rejectWithValue }
  ) => {
    try {
      if (!obj.cookies?.access_token) return rejectWithValue({ message: 'No token' });
      const { data } = await http.post('/plint-products/updatePrice', obj.plint, {
        headers: authHeader(obj.cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'updatePrice failed' });
    }
  }
);

// ВСЕ
export const getAllPlint = createAsyncThunk(
  'plint-products/all',
  async (cookie: { access_token?: string }, { rejectWithValue }) => {
    try {
      if (!cookie?.access_token) return rejectWithValue({ message: 'No token' });
      const { data } = await http.get('/plint-products/allPlint', {
        headers: authHeader(cookie.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch all failed' });
    }
  }
);

export const adjustPlintStock = createAsyncThunk(
  'plint-products/adjustStock',
  async (
    obj: Tokened & { id: string; delta: number },
    { rejectWithValue }
  ) => {
    try {
      if (!obj.cookies?.access_token) return rejectWithValue({ message: 'No token' });
      const { data } = await http.post(
        `/plint-products/${obj.id}/adjust-stock`,
        { delta: obj.delta },
        { headers: authHeader(obj.cookies.access_token) }
      );
      return data; 
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'adjust stock failed' });
    }
  }
);
