// src/plint/features/plintBuyer/plintBuyerSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {
  createPlintBuyer,
  getPlintBuyers,
  updatePlintBuyer,
  removePlintBuyer,
  linkPlintBuyerOrder,
  linkPlintBuyerDK,
} from './plintBuyerApi';

export interface PlintBuyerItem {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
  balanceAMD?: number;
  plintOrder?: any[];
  retailOrder?: any[];
  debetKredit?: any[];
  buyRetail?: any[];
  buyWholesale?: any[];
  wholesaleOrder?: any[];
  credit?: any[];
}

interface PlintBuyerState {
  items: PlintBuyerItem[];
  total: number;
  error?: string | null;
  loading: boolean;
}

const initialState: PlintBuyerState = {
  items: [],
  total: 0,
  error: null,
  loading: false,
};

export const plintBuyerSlice = createSlice({
  name: 'plintBuyer',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(getPlintBuyers.pending, (s) => { s.loading = true; })
      .addCase(getPlintBuyers.fulfilled, (s, a: any) => {
        s.loading = false;
        const p = a.payload;
        if (Array.isArray(p?.items)) {
          s.items = p.items;
          s.total = typeof p.total === 'number' ? p.total : p.items.length;
        } else if (Array.isArray(p)) {
          s.items = p; s.total = p.length;
        } else {
          s.items = []; s.total = 0;
        }
      })
      .addCase(getPlintBuyers.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? 'fetch buyers failed'; })

      .addCase(createPlintBuyer.fulfilled, (s, a: any) => { const item = a.payload; if (item?._id) s.items.unshift(item); s.total += 1; })
      .addCase(updatePlintBuyer.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; })
      .addCase(removePlintBuyer.fulfilled, (s, a: any) => { const { ok, id } = a.payload || {}; if (ok && id) { s.items = s.items.filter(x => x._id !== id); s.total = Math.max(0, s.total - 1); } })
      .addCase(linkPlintBuyerOrder.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; })
      .addCase(linkPlintBuyerDK.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; });
  },
});

export default plintBuyerSlice.reducer;
export const selectPlintBuyer = (state: any) => state.plintBuyer;
