import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type ReturnItem = { name: string; qty: number; price: number; sum: number; width?: number; height?: number };
const BASE_URL = process.env.REACT_APP_SERVER_URL!;
const authHeader = (cookies: any) => ({
  Authorization: `Bearer ${cookies?.access_token ?? ''}`,
});



export const createCoopReturn = createAsyncThunk(
  'coopReturn/create',
  async ({ cookies, payload }: {
    cookies: any;
    payload: {
      date?: string;
      groupedStretchTextureData: ReturnItem[];
      groupedStretchProfilData: ReturnItem[];
      groupedLightPlatformData: ReturnItem[];
      groupedLightRingData: ReturnItem[];
      reason?: string;
      comment?: string;
      picUrl?: string[];
      buyerId: string;
      orderId?: string;
      userId: string;
    };
  }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-return`;
    const res = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data;
  }
);

export const listCoopReturns = createAsyncThunk(
  'coopReturn/list',
  async ({ cookies, buyerId, from, to }: { cookies: any; buyerId?: string; from?: string; to?: string }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-return`;
    const res = await axios.get(url, {
      params: { buyerId, from, to },
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data as any[];
  }
);

export const deleteCoopReturn = createAsyncThunk(
  'coopReturn/delete',
  async ({ cookies, id }: { cookies: any; id: string }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-return/${id}`;
    const res = await axios.delete(url, { headers: { Authorization: `Bearer ${cookies.access_token}` } });
    return res.data as { removed: boolean };
  }
);

export const fetchCoopReturnById = createAsyncThunk(
  'coopReturn/getOne',
  async ({ cookies, id }: { cookies: any; id: string }) => {
    const url = `${BASE_URL}/coop-return/${id}`;
    const { data } = await axios.get(url, { headers: authHeader(cookies) });
    return data;
  }
);

export const deleteCoopReturnById = createAsyncThunk(
  'coopReturn/delete',
  async ({ cookies, id }: { cookies: any; id: string }) => {
    const url = `${BASE_URL}/coop-return/${id}`;
    const { data } = await axios.delete(url, { headers: authHeader(cookies) });
    return data;
  }
);