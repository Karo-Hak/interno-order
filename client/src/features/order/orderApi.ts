import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const addNewOrder = createAsyncThunk(
  'order/new/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/order", { ...obj }, {
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

export const updatePrepayment = createAsyncThunk(
  'order/updatePrepayment/axios',
  async (obj: any) => {
    console.log(obj);
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/order/updatePrepayment", {...obj},  {
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



export const viewNewOrders = createAsyncThunk(
  'order/newOrders/axios',
  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/order/findNew", {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      })

      return response.data
    } catch (e) {
      return { error: "not found" }

    }
  }
);

export const findOrder = createAsyncThunk(
  'order/findOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/order/findOrder/" + obj.params.id, {
        headers: {
          Authorization: `Bearer ${obj.cookies.access_token}`
        }
      })
      return response.data
    } catch (e) {
      return { error: "not found" }
    }
  }
)
export const findNewOrder = createAsyncThunk(
  'order/findNewOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/order/findNewOrder/" + obj.params.id, {
        headers: {
          Authorization: `Bearer ${obj.cookies.access_token}`
        }
      })
      return response.data
    } catch (e) {
      return { error: "not found" }
    }
  }
)




export const updateOrder = createAsyncThunk(
  'order/update/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/order/updateOrder/" + obj.id, {
        headers: {
          Authorization: `Bearer ${obj.cookies.access_token}`
        }
      })
      return response.data
    } catch (e) {
      return { error: "not found" }
    }

  }
)

export const searchOrder = createAsyncThunk(
  'order/search/axios',
  async (obj: any) => {
    console.log(obj);
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/order/search", { ...obj }, {
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




