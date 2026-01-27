import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const viewCoopDebetKredit = createAsyncThunk(
  'coopDebetKredit/axios',
  async (data: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/coop-debet-kredit/view", { ...data}, {
        headers: {
          Authorization: `Bearer ${data.cookies.access_token}`
        }
      })

      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);
export const addCoopPayed = createAsyncThunk(
  'coopDebetKredit/pay/axios',
  async (
    data: { cookies: any; sum: number; buyerId: string; id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/coop-debet-kredit/pay",
        {
          sum: data.sum,
          buyerId: data.buyerId,
          ...(data.id ? { id: data.id } : {}),
        },
        {
          headers: { Authorization: `Bearer ${data.cookies.access_token}` },
        }
      );

      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message ?? 'not found');
    }
  }
);

export const addCoopReturnPayed = createAsyncThunk(
  'coopDebetKredit/pay/axios',
  async (data: any) => {
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/coop-debet-kredit/payReturn", { ...data}, {
        headers: {
          Authorization: `Bearer ${data.cookies.access_token}`
        }
      })

      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);

export const findCoopDebetByBuyer = createAsyncThunk(
  'CoopdebetKredit/findCoopDebetByBuyer/axios',
  async (data: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +`/coop-debet-kredit/findCoopStretchOrder/${data.buyerId[0]}`, {
        headers: {
          Authorization: `Bearer ${data.cookies.access_token}`
        }
      })

      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);

export const deleteCoopPaymentByDkId = createAsyncThunk(
  'coop/dk/deleteById',
  async ({ cookies, dkId }: { cookies: any; dkId: string }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-debet-kredit/${dkId}`;
    const res = await axios.delete(url, {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data as { deleted: boolean };
  }
);

export const deleteCoopPaymentByDateSum = createAsyncThunk(
  'coop/dk/deleteByDateSum',
  async ({ cookies, buyerId, date, sum }: { cookies: any; buyerId: string; date: string; sum: number }) => {
    const url = `${process.env.REACT_APP_SERVER_URL}/coop-debet-kredit/delete-by-date-sum`;
    const res = await axios.post(url, { buyerId, date, sum }, {
      headers: { Authorization: `Bearer ${cookies.access_token}` },
    });
    return res.data as { deleted: boolean };
  }
);

// export const getDebetKredit = createAsyncThunk(
//   'strechTexture/all/axios',
//   async (cookie: any) => {
//     try {
//       const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretchTexture", {
//         headers: {
//           Authorization: `Bearer ${cookie.access_token}`
//         }
//       })
//       return response.data
//     } catch (e) {
//       return { error: "not found" }

//     }
//   }
// );

