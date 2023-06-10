import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "./userSlice";

export const myLink = (url: string) => {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(e => reject(e))
  })
}


export const newUser = createAsyncThunk(
  'user/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/user", { ...obj.user }, {
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

export const userProfile = createAsyncThunk(
  'user/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +"/user/profile", {
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


export const allUser = createAsyncThunk(
  'user/allUser/axios',
  async (cookie: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL +"/user/allUser", {
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


export const loginUser = createAsyncThunk(
  'user/axios',
  async (us: User) => {
    const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/auth/login", { ...us })
    return response.data
  }
);

export const logoutUser = createAsyncThunk(
  'user/axios',
  async (cookie: any) => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL +"/user/logout", {
      headers: {
        Authorization: `Bearer ${cookie.access_token}`
      }
    })
    return response.data
  }
);

export const getAdminUser = createAsyncThunk(
  'user/axios',
  async () => {
    const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/auth/login", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    })
    return response.data
  }
);

