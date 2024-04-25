import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const addNewCoopStretchOrder = createAsyncThunk(
  'coopStretchOrder/new/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coop-ceiling-order", { ...obj }, {
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

export const viewCoopOrdersList = createAsyncThunk(
  'coopStretchOrder/viewCoopOrdersList/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coop-ceiling-order/viewCoopOrdersList", obj, {
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

export const findCoopStretchOrder = createAsyncThunk(
  'coopStretchOrder/findCoopStretchOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/coop-ceiling-order/findCoopStretchOrder/" + obj.params.id, {
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

export const updateCoopPrepayment = createAsyncThunk(
  'coopStretchOrder/updateCoopStretchOrderPrepayment/axios',
  async (obj: any) => {
    console.log(obj);

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/coopStretchOrder/updateCoopStretchOrderPrepayment", { ...obj }, {
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



export const viewNewCoopStretchOrder = createAsyncThunk(
  'coopStretchOrder/viewNewCoopStretchOrder/axios',
  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/coopStretchOrder/findNewCoopStretchOrder", {
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


export const findNewCoopStretchOrder = createAsyncThunk(
  'coopStretchOrder/findNewCoopStretchOrder/axios',
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




// export const updateStatus = createAsyncThunk(
//   'order/updateStatus/axios',
//   async (obj: any) => {
//     try {
//       const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/order/updateStatus/" + obj.id, {
//         headers: {
//           Authorization: `Bearer ${obj.cookies.access_token}`
//         }
//       })
//       return response.data
//     } catch (e) {
//       return { error: "not found" }
//     }

//   }
// )

export const searchCoopStretchOrder = createAsyncThunk(
  'coopStretchOrder/search/axios',
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


