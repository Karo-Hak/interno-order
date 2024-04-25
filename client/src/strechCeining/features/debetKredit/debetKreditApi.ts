import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const viewDebetKredit = createAsyncThunk(
  'debetKredit/axios',
  async (data: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/debet-kredit/view", { ...data}, {
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
export const addPayed = createAsyncThunk(
  'debetKredit/pay/axios',
  async (data: any) => {
    console.log(data);
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/debet-kredit/pay", { ...data}, {
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

