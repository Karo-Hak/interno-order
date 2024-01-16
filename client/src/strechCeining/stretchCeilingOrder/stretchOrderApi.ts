import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const addNewStretchOrder = createAsyncThunk(
  'stretchOrder/new/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order", { ...obj }, {
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
  'stretchOrder/updateStretchOrderPrepayment/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretchOrder/updateStretchOrderPrepayment", { ...obj }, {
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
  'stretchOrder/viewNewStretchOrder/axios',
  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/findNew", {
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

export const findStretchOrder = createAsyncThunk(
  'stretchOrder/findStretchOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/findStretchOrder/" + obj.params.id, {
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
export const findNewStretchOrder = createAsyncThunk(
  'stretchOrder/findNewStretchOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretchOrder/findNewStretchOrder/" + obj.params.id, {
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

export const searchStretchOrder = createAsyncThunk(
  'stretchOrder/search/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretchOrder/search", { ...obj }, {
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

export const updateStretchOrderAll = createAsyncThunk(
  'stretchOrder/updateStretchOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretchOrder/updateStretchOrder/" + obj.params.id, obj, {
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


