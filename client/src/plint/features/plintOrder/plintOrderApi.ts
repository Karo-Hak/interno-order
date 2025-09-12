import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const addNewPlintOrder = createAsyncThunk(
  'plintOrder/new/axios',
  async (obj: any) => {
    console.log(obj);
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/plintOrder", { ...obj }, {
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
export const editPlintOrder = createAsyncThunk(
  'plintOrder/update/new/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/plintOrder/update/" + obj.params.id, { ...obj }, {
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

export const viewNewPlintOrder = createAsyncThunk(
  'plintOrder/viewNewPlintOrder/axios',
  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/plintOrder/findNew", {
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

export const viewPlintOrdersList = createAsyncThunk(
  'plintOrder/viewPlintOrdersList/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/plintOrder/viewPlintOrdersList", obj, {
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

export const findPlintOrder = createAsyncThunk(
  'plintOrder/findPlintOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/plintOrder/findPlintOrder/" + obj.params.id, {
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

export const addPlintPayed = createAsyncThunk(
  'plintDebetKredit/pay/axios',
  async (data: any) => {
   
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL +"/plint-debet-kredit/pay", { ...data}, {
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

export const updatePlintDone = createAsyncThunk(
  'plintOrder/updatePlintDone/axios',
  async (obj: any) => {
    try {
      const response = await axios.put(process.env.REACT_APP_SERVER_URL + "/plintOrder/updateStatus/" + obj.params.id, {
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







export const findNewPlintOrder = createAsyncThunk(
  'plintOrder/findNewPlintOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/coopStretchOrder/findNewCoopStretchOrder/" + obj.params.id, {
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






export const searchPlintOrder = createAsyncThunk(
  'plintOrder/search/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coopStretchOrder/search", { ...obj }, {
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

export const updateCoopStretchOrderAll = createAsyncThunk(
  'coopStretchOrder/updateCoopStretchOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coopStretchOrder/updateCoopStretchOrder/" + obj.params.id, obj, {
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


