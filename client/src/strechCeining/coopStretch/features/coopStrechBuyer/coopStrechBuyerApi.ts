import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}



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
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +"/coopstretchbuyer", {
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



