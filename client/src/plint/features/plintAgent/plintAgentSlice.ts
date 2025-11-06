import { createSlice } from '@reduxjs/toolkit';
import {
  createPlintAgent,
  getPlintAgents,
  updatePlintAgent,
  removePlintAgent,
  linkPlintAgentOrder,
  linkPlintAgentDK,
} from './plintAgentApi';

export interface PlintAgentItem {
  _id: string;
  name: string;
  phone1?: string;
  phone2?: string;
  region?: string;
  address?: string;
  plintOrder?: any[];
  debetKredit?: any[];
}

interface PlintAgentState {
  items: PlintAgentItem[];
  total: number;
  error?: string | null;
  loading: boolean;
}

const initialState: PlintAgentState = {
  items: [],
  total: 0,
  error: null,
  loading: false,
};

export const plintAgentSlice = createSlice({
  name: 'plintAgent',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(getPlintAgents.pending, (s) => { s.loading = true; })
      .addCase(getPlintAgents.fulfilled, (s, a: any) => {
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
      .addCase(getPlintAgents.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? 'fetch Agents failed'; })

      .addCase(createPlintAgent.fulfilled, (s, a: any) => { const item = a.payload; if (item?._id) s.items.unshift(item); s.total += 1; })
      .addCase(updatePlintAgent.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; })
      .addCase(removePlintAgent.fulfilled, (s, a: any) => { const { ok, id } = a.payload || {}; if (ok && id) { s.items = s.items.filter(x => x._id !== id); s.total = Math.max(0, s.total - 1); } })
      .addCase(linkPlintAgentOrder.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; })
      .addCase(linkPlintAgentDK.fulfilled, (s, a: any) => { const item = a.payload; const i = s.items.findIndex(x => x._id === item?._id); if (i !== -1) s.items[i] = item; });
  },
});

export default plintAgentSlice.reducer;
export const selectPlintAgent = (state: any) => state.plintAgent;
