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
  async (data: any) => {
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/coop-debet-kredit/pay", { ...data}, {
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

