import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const viewStretchWallet = createAsyncThunk(
  'stretchWallet/axios',
  async (data: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/stretch-wallet/view", { ...data}, {
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
export const addPayedWallet = createAsyncThunk(
  'stretchWallet/payments/axios',
  async (data: any) => {
   console.log(data);
   
    try {
      const response = await axios.patch(process.env.REACT_APP_SERVER_URL +`/stretch-credit/payments/${data.params}`, { ...data}, {
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

export const findDebetByBuyer = createAsyncThunk(
  'stretchWallet/findDebetByBuyer/axios',
  async (data: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +`/stretch-credit/findStretchOrder/${data.buyerId[0]}`, {
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
export const stretchWalletFindAll = createAsyncThunk(
  'strechWallet/all/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretch-credit", {
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
// export const stretchWalletFindAll11 = createAsyncThunk(
//   'strechWallet/all/axios',
//   async (cookie: any) => {
//     try {
//       const response = await axios.patch(process.env.REACT_APP_SERVER_URL + "/stretch-credit/wallets/clear-all-payments", {
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


