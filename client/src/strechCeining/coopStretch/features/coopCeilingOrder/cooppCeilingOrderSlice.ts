import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';

import {
  createCoopOrder,
  listCoopOrders,
  getCoopOrder,
  updateCoopOrder,
  deleteCoopOrder,
  type CoopCeilingOrderModel,
  type ApiError,
} from './coopCeilingOrderApi';

const ordersAdapter = createEntityAdapter<CoopCeilingOrderModel>({
  selectId: (o) => o._id,
  sortComparer: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
});

type ExtraState = {
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  lastCreatedId: string | null;
  lastDeletedId: string | null;
};

const initialState = ordersAdapter.getInitialState<ExtraState>({
  loading: false,
  error: null,
  selectedId: null,
  lastCreatedId: null,
  lastDeletedId: null,
});

const slice = createSlice({
  name: 'coopCeilingOrders',
  initialState,
  reducers: {
    setSelectedOrder(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    upsertManyLocal(state, action: PayloadAction<CoopCeilingOrderModel[]>) {
      ordersAdapter.upsertMany(state, action.payload);
    },
    upsertOneLocal(state, action: PayloadAction<CoopCeilingOrderModel>) {
      ordersAdapter.upsertOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    // LIST
    builder.addCase(listCoopOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listCoopOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      ordersAdapter.setAll(state, payload);
    });
    builder.addCase(listCoopOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError)?.message || action.error.message || 'Failed to load orders';
    });

    // GET ONE
    builder.addCase(getCoopOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCoopOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      ordersAdapter.upsertOne(state, payload.order);
    });
    builder.addCase(getCoopOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError)?.message || action.error.message || 'Failed to fetch order';
    });

    // CREATE
    builder.addCase(createCoopOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.lastCreatedId = null;
    });
    builder.addCase(createCoopOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.lastCreatedId = payload.orderId || null;
    });
    builder.addCase(createCoopOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError)?.message || action.error.message || 'Failed to create order';
    });

    // UPDATE
    builder.addCase(updateCoopOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCoopOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      ordersAdapter.upsertOne(state, payload.order);
    });
    builder.addCase(updateCoopOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError)?.message || action.error.message || 'Failed to update order';
    });

    // DELETE
    builder.addCase(deleteCoopOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.lastDeletedId = null;
    });
    builder.addCase(deleteCoopOrder.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.meta.arg.id;
      ordersAdapter.removeOne(state, id);
      state.lastDeletedId = id;
      if (state.selectedId === id) state.selectedId = null;
    });
    builder.addCase(deleteCoopOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError)?.message || action.error.message || 'Failed to delete order';
    });
  },
});

export const {
  setSelectedOrder,
  clearError,
  upsertManyLocal,
  upsertOneLocal,
} = slice.actions;

export default slice.reducer;

// selectors
const baseSelectors = ordersAdapter.getSelectors<RootState>(
  (s) => s.coopCeilingOrders
);

export const selectAllCoopOrders = baseSelectors.selectAll;
export const selectCoopOrderById = baseSelectors.selectById;
export const selectCoopOrderIds = baseSelectors.selectIds;

export const selectCoopOrdersLoading = (s: RootState) => s.coopCeilingOrders.loading;
export const selectCoopOrdersError = (s: RootState) => s.coopCeilingOrders.error;
export const selectSelectedCoopOrderId = (s: RootState) => s.coopCeilingOrders.selectedId;
export const selectLastCreatedOrderId = (s: RootState) => s.coopCeilingOrders.lastCreatedId;
export const selectLastDeletedOrderId = (s: RootState) => s.coopCeilingOrders.lastDeletedId;
