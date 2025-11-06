import { createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '../../../api/http';

type Tokened = { cookies: { access_token?: string } };
const authHeader = (t?: string) => (t ? { Authorization: `Bearer ${t}` } : {});

// CREATE
export const createPlintAgent = createAsyncThunk(
  'plint-agent/create',
  async (obj: Tokened & { agent: { name: string; phone1?: string; phone2?: string; region?: string; address?: string } }, { rejectWithValue }) => {
    try {
      const { data } = await http.post('/plint-agent', obj.agent, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'create agent failed' });
    }
  }
);

// LIST
export const getPlintAgents = createAsyncThunk(
  'plint-agent/list',
  async (obj: Tokened & { q?: string; skip?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/plint-agent', {
        headers: authHeader(obj.cookies.access_token),
        params: { q: obj.q, skip: obj.skip, limit: obj.limit },
      });
      return data; // {items, total, ...}
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'fetch agents failed' });
    }
  }
);

// UPDATE
export const updatePlintAgent = createAsyncThunk(
  'plint-agent/update',
  async (obj: Tokened & { id: string; dto: Partial<{ name: string; phone1: string; phone2: string; region: string; address: string }> }, { rejectWithValue }) => {
    try {
      const { data } = await http.patch(`/plint-agent/${obj.id}`, obj.dto, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'update agent failed' });
    }
  }
);

// REMOVE
export const removePlintAgent = createAsyncThunk(
  'plint-agent/remove',
  async (obj: Tokened & { id: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.delete(`/plint-agent/${obj.id}`, { headers: authHeader(obj.cookies.access_token) });
      return { ...data, id: obj.id };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'remove agent failed' });
    }
  }
);

// LINK ORDER
export const linkPlintAgentOrder = createAsyncThunk(
  'plint-agent/link-order',
  async (obj: Tokened & { id: string; orderId: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(`/plint-agent/${obj.id}/link-order`, { orderId: obj.orderId }, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'link order failed' });
    }
  }
);

// LINK DK
export const linkPlintAgentDK = createAsyncThunk(
  'plint-agent/link-dk',
  async (obj: Tokened & { id: string; dkId: string }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(`/plint-agent/${obj.id}/link-dk`, { dkId: obj.dkId }, { headers: authHeader(obj.cookies.access_token) });
      return data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data ?? { message: 'link dk failed' });
    }
  }
);
