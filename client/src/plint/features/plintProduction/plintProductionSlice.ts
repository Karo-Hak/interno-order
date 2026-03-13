import { createSlice } from '@reduxjs/toolkit';
import {
  getPlintProductions,
  newPlintProduction,
  removePlintProduction,
  updatePlintProduction,
  getPlintProductionStats,
} from './plintProductionApi';

export interface PlintProduction {
  _id: string;
  date: string;
  name?: string;
  quantity: number;
  plint: {
    _id: string;
    name: string;
    retailPriceAMD: number;
    wholesalePriceAMD: number;
  };
  user: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

export interface CreatePlintProductionDto {
  date?: string;
  name?: string;
  quantity: number;
  plint: string;
  user: string;
}

interface PlintProductionState {
  items: PlintProduction[];
  total: number;
  stats?: {
    totalQty: number;
    count: number;
  } | null;
  error?: string | null;
  loading: boolean;
}

const initialState: PlintProductionState = {
  items: [],
  total: 0,
  stats: null,
  error: null,
  loading: false,
};

export const plintProductionSlice = createSlice({
  name: 'plintProduction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPlintProductions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlintProductions.fulfilled, (state, action: any) => {
        const p = action.payload;
        state.loading = false;
        if (!p || p.error) {
          state.error = p?.error || 'fetch productions failed';
          return;
        }
        if (Array.isArray(p.items)) {
          state.items = p.items;
          state.total = typeof p.total === 'number' ? p.total : p.items.length;
        } else if (Array.isArray(p)) {
          state.items = p;
          state.total = p.length;
        } else {
          state.items = [];
          state.total = 0;
        }
        state.error = null;
      })
      .addCase(getPlintProductions.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'fetch productions failed';
      });

    builder
      .addCase(newPlintProduction.pending, (state) => {
        state.loading = true;
      })
      .addCase(newPlintProduction.fulfilled, (state, action: any) => {
        state.loading = false;
        const item = action.payload;
        if (!item || item.error) return;
        state.items.unshift(item);
        state.total += 1;
        state.error = null;
      })
      .addCase(newPlintProduction.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'create production failed';
      });

    builder
      .addCase(updatePlintProduction.fulfilled, (state, action: any) => {
        const item = action.payload;
        if (!item || !item._id) return;
        const i = state.items.findIndex((x) => x._id === item._id);
        if (i !== -1) state.items[i] = item;
      })
      .addCase(updatePlintProduction.rejected, (state, action: any) => {
        state.error = action.payload?.message ?? 'update production failed';
      });

    builder
      .addCase(removePlintProduction.fulfilled, (state, action: any) => {
        const { ok, id } = action.payload || {};
        if (!ok || !id) return;
        state.items = state.items.filter((x) => x._id !== id);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(removePlintProduction.rejected, (state, action: any) => {
        state.error = action.payload?.message ?? 'remove production failed';
      });

    builder.addCase(getPlintProductionStats.fulfilled, (state, action: any) => {
      const p = action.payload;
      if (p && !p.error) {
        state.stats = {
          totalQty: Number(p.totalQty ?? 0),
          count: Number(p.count ?? 0),
        };
      }
    });
  },
});

export const selectPlintProduction = (state: any) => state.plintProduction;

export default plintProductionSlice.reducer;
