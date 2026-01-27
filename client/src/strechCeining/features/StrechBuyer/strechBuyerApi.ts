import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}

export type StretchBuyerEntry = {
  date?: string;        // ISO
  sum: number;
  orderId?: string;
};

export type StretchBuyerModel = {
  _id: string;
  buyerName: string;
  buyerPhone1: string;
  buyerPhone2?: string;
  buyerRegion?: string;
  buyerAddress?: string;
  order?: string[];
  debetKredit?: string[];
  buy?: StretchBuyerEntry[];
  credit?: StretchBuyerEntry[];
  totalSum?: number;
};

type DeleteCreditReq = {
  cookies: any;
  buyerId: string;
  creditSum: number;
  creditDate: string;
  orderId: string;
};

type DeleteCreditRes =
  | { removed: boolean }
  | { message?: string; error?: string };


export const newStretchBuyer = createAsyncThunk(
  'stetchBuyer/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretchBuyer", { ...obj.stretchBuyer }, {
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
export const deleteCredit = createAsyncThunk<DeleteCreditRes, DeleteCreditReq>(
  'stretchBuyer/deleteCredit/axios',
  async (obj, { rejectWithValue }) => {
    try {
      const body = {
        id: obj.buyerId,
        prepayment: obj.creditSum,
        date: obj.creditDate,
        orderId: obj.orderId,
      };
      const url = `${process.env.REACT_APP_SERVER_URL}/stretchBuyer/deleteCredit`;
      const response = await axios.post<DeleteCreditRes>(url, body, {
        headers: { Authorization: `Bearer ${obj.cookies.access_token}` },
      });
      return response.data;
    } catch (e: any) {
      // если сервер вернул тело ошибки — пробрасываем его
      const data = e?.response?.data ?? { error: 'not found' };
      return rejectWithValue(data as DeleteCreditRes);
    }
  }
);

export const allStretchBuyer = createAsyncThunk(
  'stretchBuyer/allStretchBuyer/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretchBuyer", {
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

type AuthCookies = { access_token?: string } & Record<string, any>;

export const allStretchBuyerThunk = createAsyncThunk<
  StretchBuyerModel[],               // return
  AuthCookies,                       // arg
  { rejectValue: { error: string } } // reject payload
>(
  'stretchBuyer/all',
  async (cookies, { rejectWithValue }) => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/stretchBuyer`;
      const token = cookies?.access_token as string | undefined;

      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      // ожидаем ответ вида: { messege?: string, buyer: [...] }
      const data = response.data;
      const rows: StretchBuyerModel[] = Array.isArray(data?.buyer)
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


