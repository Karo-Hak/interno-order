import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

type Cookies = { access_token?: string };
type WithCookies<T> = T & { cookies: Cookies };

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const authHeaders = (cookies: Cookies) => ({
  Authorization: `Bearer ${cookies?.access_token ?? ""}`,
});

const getErr = (e: unknown) => {
  const err = e as AxiosError<any>;
  return {
    error: err?.response?.data?.message ?? err?.message ?? "not found",
    status: err?.response?.status,
  };
};

// Короткая форма данных заказа, полезна для "показать по заказам"
export type OrderBrief = {
  _id: string;
  buyerName?: string;
  buyerPhone1?: string;
  prepayment?: number;
  groundTotal?: number;
};

// Полный объект заказа, если понадобятся детали
export type StretchOrder = {
  _id: string;
  buyer?: string | { _id: string; name?: string; phone1?: string };
  buyerName?: string;
  buyerPhone1?: string;
  prepayment?: number;
  groundTotal?: number;
  totalSum?: number;
  // ...другие поля, которые есть у тебя на бэке
};


export const addNewStretchOrder = createAsyncThunk(
  'stretchOrder/new/axios',
  async (obj: any) => {
    console.log(obj, "asd");

    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order", obj, {
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
export const updateStatuse = createAsyncThunk(
  'stretchOrder/updateStretchOrderStatuse/axios',
  async (obj: any) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/stretch-ceiling-order/updateStretchOrderStatuse/${obj.params.id}`,
        { status: obj.status },
        {
          headers: {
            Authorization: `Bearer ${obj.cookies.access_token}`
          }
        }
      );

      return response.data;
    } catch (e) {
      return { error: "not found" };
    }
  }
);
export const updateStretchPayed = createAsyncThunk(
  'stretchOrder/updateStretchPayed/axios',
  async (obj: any) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/stretch-ceiling-order/updateStretchPayed/${obj.params.id}`,
        { status: obj.status },
        {
          headers: {
            Authorization: `Bearer ${obj.cookies.access_token}`
          }
        }
      );

      return response.data;
    } catch (e) {
      return { error: "not found" };
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
export const viewNewMesurOrders = createAsyncThunk(
  'stretchOrder/viewNewMesurStretchOrder/axios',

  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/findNewMesur", {
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
export const viewNewInstalOrders = createAsyncThunk(
  'stretchOrder/viewNewInstalStretchOrder/axios',

  async (cookies: any) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/findNewInstal", {
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
export const viewOrdersList = createAsyncThunk(
  'stretchOrder/viewOrdersList/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/viewOrdersList", obj, {
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
export const viewMaterialList = createAsyncThunk(
  'stretchOrder/viewMaterialList/axios',
  async (obj: any) => {
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/viewMaterialList", obj, {
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

export const deletOrder = createAsyncThunk(
  'stretchOrder/deletOrder/axios',
  async (obj: any) => {
    try {
      const response = await axios.delete(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/" + obj.params.id, {
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




export const updateStretchOrderAll = createAsyncThunk(
  'stretchOrder/updateStretchOrder/axios',
  async (obj: any) => {
    console.log(obj);
    
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_URL + "/stretch-ceiling-order/updateStretchOrder/" + obj.params.id, obj, {
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
