import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export type CoopStretchBuyerEntry = {
  date?: string;        // ISO
  sum: number;
  orderId?: string;
};

export type CoopStretchBuyerModel = {
  _id: string;
  name: string;
  phone1: string;
  phone2?: string;
  region?: string;
  address?: string;
  order?: string[];
  debetKredit?: string[];
  buy?: CoopStretchBuyerEntry[];
  credit?: CoopStretchBuyerEntry[];
  totalSum?: number;
};

type AuthCookies = { access_token?: string } & Record<string, any>;

export const allCoopStretchBuyerThunk = createAsyncThunk<
  CoopStretchBuyerModel[],               // return
  AuthCookies,                       // arg
  { rejectValue: { error: string } } // reject payload
>(
  'stretchBuyer/all',
  async (cookies, { rejectWithValue }) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/coopStretchBuyer`;
      const token = cookies?.access_token as string | undefined;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      //  { messege?: string, buyer: [...] }
      const data = response.data;
      const rows: CoopStretchBuyerModel[] = Array.isArray(data?.buyer)
        ? data.buyer
        : Array.isArray(data)
          ? data
          : [];

      return rows;
    } catch (e: any) {
      const err = e?.response?.data?.error || e?.message || 'not found';
      return rejectWithValue({ error: err });
    }
  }
);



export const newCoopStretchBuyer = createAsyncThunk(
  'coopStetchBuyer/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coopstretchbuyer", { ...obj.coopStretchBuyer }, {
        headers: {
          Authorization: `Bearer ${obj.cookies.access_token}`
        }
      })
      return response.data
    } catch (e) {
      return { error: "not found" }
    }
  }
);

export const allCoopStretchBuyer = createAsyncThunk(
  'coopStretchBuyer/allCoopStretchBuyer/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/coopstretchbuyer", {
        headers: {
          Authorization: `Bearer ${cookie.access_token}`
        }
      })
      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);


export const allCoopBuyerThunk = createAsyncThunk<
  CoopStretchBuyerModel[],               // return
  AuthCookies,                       // arg
  { rejectValue: { error: string } } // reject payload
>(
  'coopStretchBuyer/all',
  async (cookies, { rejectWithValue }) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/coopStretchBuyer`;
      const token = cookies?.access_token as string | undefined;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // ожидаем ответ вида: { messege?: string, buyer: [...] }
      const data = response.data;
      const rows: CoopStretchBuyerModel[] = Array.isArray(data?.buyer)
        ? data.buyer
        : Array.isArray(data)
        ? data
        : [];

      return rows;
    } catch (e: any) {
      const err = e?.response?.data?.error || e?.message || 'not found';
      return rejectWithValue({ error: err });
    }
  }
);


