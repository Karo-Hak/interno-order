import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const newUserSphere = createAsyncThunk(
  'userSphere/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/userSphere", { ...obj.texture }, {
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

export const getUserSphere = createAsyncThunk(
  'userSphere/all/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/userSphere", {
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

export const getAllUserSphere = createAsyncThunk(
  'userSphere/allLogin/axios',
  async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/userSphere")
      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);

