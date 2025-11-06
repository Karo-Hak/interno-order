import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';

type Tokened = { cookies: { access_token?: string } };

function authHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ✅ СОЗДАНИЕ ПРОИЗВОДСТВА
export const newPlintProduction = createAsyncThunk(
  'plintProduction/new',
  async (
    obj: {
      plintProduction: {
        date?: string;
        name?: string;
        quantity: number;
        plint: string;
        user: string;
      };
      cookies: { access_token?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await http.post('/plint-production', obj.plintProduction, {
        headers: authHeader(obj.cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create production failed' });
    }
  }
);

// ✅ ВСЕ ПРОИЗВОДСТВА
export const getPlintProductions = createAsyncThunk(
  'plintProduction/all',
  async (
    obj: { cookies: { access_token?: string }; query?: { limit?: number; skip?: number } },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await http.get('/plint-production', {
        headers: authHeader(obj.cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch productions failed' });
    }
  }
);

// ✅ УДАЛЕНИЕ
export const removePlintProduction = createAsyncThunk(
  'plintProduction/remove',
  async (obj: { id: string; cookies: { access_token?: string } }, { rejectWithValue }) => {
    try {
      const { data } = await http.delete(`/plint-production/${obj.id}`, {
        headers: authHeader(obj.cookies.access_token),
      });
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'delete production failed' });
    }
  }
);

// ✅ ОБНОВЛЕНИЕ
export const updatePlintProduction = createAsyncThunk(
  'plintProduction/update',
  async (
    obj: {
      id: string;
      dto: Partial<{ date: string; name: string; quantity: number; plint: string }>;
      cookies: { access_token?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await http.patch(`/plint-production/${obj.id}`, obj.dto, {
        headers: authHeader(obj.cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'update production failed' });
    }
  }
);

// ✅ СТАТИСТИКА
export const getPlintProductionStats = createAsyncThunk(
  'plintProduction/stats',
  async (cookies: { access_token?: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/plint-production/stats/total', {
        headers: authHeader(cookies.access_token),
      });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch stats failed' });
    }
  }
);
