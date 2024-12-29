import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const viewPlintDebetKredit = createAsyncThunk(
  'plintDebetKredit/axios',
  async (data: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/plint-debet-kredit/view", { ...data}, {
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
export const addPlintPayed = createAsyncThunk(
  'plintDebetKredit/pay/axios',
  async (data: any) => {
   
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/plint/plint-debet-kredit/pay", { ...data}, {
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

export const findPlintDebetByBuyer = createAsyncThunk(
  'plintDebetKredit/findPlintDebetByBuyer/axios',
  async (data: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +`/plint/plint-debet-kredit/findPlintOrder/${data.buyerId[0]}`, {
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

