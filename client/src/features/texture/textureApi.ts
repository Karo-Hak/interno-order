import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const newTexture = createAsyncThunk(
  'texture/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/texture", { ...obj.texture }, {
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

export const getAllTexture = createAsyncThunk(
  'texture/all/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/texture", {
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

