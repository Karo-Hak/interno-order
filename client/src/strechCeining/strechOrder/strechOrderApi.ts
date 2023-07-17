import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const addNewStrechOrder = createAsyncThunk(
  'strechOrder/new/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/StrechOrder", { ...obj }, {
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
  'order/updateStrechOrderPrepayment/axios',
  async (obj: any) => {
    console.log(obj);

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/StrechOrder/updateStrechOrderPrepayment", { ...obj }, {
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



export const viewNewStrechOrder = createAsyncThunk(
  'strechOrder/viewNewStrechOrder/axios',
  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/strechOrder/findNewStrechOrder", {
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

export const findStrechOrder = createAsyncThunk(
  'strechOrder/findStrechOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/strechOrder/findStrechOrder/" + obj.params.id, {
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
export const findNewStrechOrder = createAsyncThunk(
  'strechOrder/findNewStrechOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/strechOrder/findNewStrechOrder/" + obj.params.id, {
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

export const searchStrechOrder = createAsyncThunk(
  'strechOrder/search/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/strechOrder/search", { ...obj }, {
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

export const updateStrechOrderAll = createAsyncThunk(
  'strechOrder/updateStrechOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/order/updateStrechOrder/" + obj.params.id, obj, {
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


