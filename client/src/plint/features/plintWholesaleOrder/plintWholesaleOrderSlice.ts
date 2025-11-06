import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import {
  createPlintWholesaleOrder,
  getPlintWholesaleOrderById,
  listPlintWholesaleOrdersByBuyer,
  updatePlintWholesaleOrder,
  addPlintWholesaleOrderPayment,
  WholesaleItem,
} from './plintWholesaleOrderApi';

export type PlintWholesaleOrderModel = {
  _id: string;
  buyer: string;
  items: WholesaleItem[];
  groupedPlintData?: object[];
  date: string;
  buyerComment?: string;
  paymentMethod?: string;
  delivery?: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliverySum: number;
  totalSum: number;
  prepayment: number;
  balance: number;
  status: 'active' | 'canceled' | 'closed';
  user?: string;
};

type ListState = {
  items: PlintWholesaleOrderModel[];
  loading: boolean;
  error?: any;
  // можно добавлять total/skip/limit если бэк будет отдавать
};

type CurrentState = {
  data?: PlintWholesaleOrderModel | null;
  loading: boolean;
  error?: any;
};

type FlagsState = {
  creating: boolean;
  updating: boolean;
  paying: boolean;
  canceling: boolean;
};

export type PlintWholesaleOrderState = {
  list: ListState;
  current: CurrentState;
  flags: FlagsState;
};

const initialState: PlintWholesaleOrderState = {
  list: { items: [], loading: false, error: undefined },
  current: { data: null, loading: false, error: undefined },
  flags: {
    creating:  false,
    updating:  false,
    paying:    false,
    canceling: false,
  },
};

const slice = createSlice({
  name: 'plintWholesaleOrder',
  initialState,
  reducers: {
    // если нужно руками очистить current
    resetCurrent(state) {
      state.current = { data: null, loading: false, error: undefined };
    },
  },
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createPlintWholesaleOrder.pending, (s) => {
      s.flags.creating = true;
    });
    builder.addCase(createPlintWholesaleOrder.fulfilled, (s, { payload }) => {
      s.flags.creating = false;
      s.current.data = payload; // только что созданный заказ
      s.current.error = undefined;
    });
    builder.addCase(createPlintWholesaleOrder.rejected, (s, { payload }) => {
      s.flags.creating = false;
      s.current.error = payload;
    });

    // GET BY ID
    builder.addCase(getPlintWholesaleOrderById.pending, (s) => {
      s.current.loading = true;
      s.current.error = undefined;
    });
    builder.addCase(getPlintWholesaleOrderById.fulfilled, (s, { payload }) => {
      s.current.loading = false;
      s.current.data = payload;
    });
    builder.addCase(getPlintWholesaleOrderById.rejected, (s, { payload }) => {
      s.current.loading = false;
      s.current.error = payload;
    });

    // LIST BY BUYER
    builder.addCase(listPlintWholesaleOrdersByBuyer.pending, (s) => {
      s.list.loading = true;
      s.list.error = undefined;
    });
    builder.addCase(listPlintWholesaleOrdersByBuyer.fulfilled, (s, { payload }) => {
      s.list.loading = false;
      s.list.items = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(listPlintWholesaleOrdersByBuyer.rejected, (s, { payload }) => {
      s.list.loading = false;
      s.list.error = payload;
    });

    // UPDATE
    builder.addCase(updatePlintWholesaleOrder.pending, (s) => {
      s.flags.updating = true;
    });
    builder.addCase(updatePlintWholesaleOrder.fulfilled, (s, { payload }) => {
      s.flags.updating = false;
      // payload: { ok: true, id }
      const id = payload?.id as string | undefined;
      if (id && s.current.data && s.current.data._id === id) {
        // после обновления — можно инициировать повторную загрузку на уровне компонента
        // либо оставить как есть и доверять данным из формы
      }
    });
    builder.addCase(updatePlintWholesaleOrder.rejected, (s, { payload }) => {
      s.flags.updating = false;
      s.current.error = payload;
    });

    // ADD PAYMENT
    builder.addCase(addPlintWholesaleOrderPayment.pending, (s) => {
      s.flags.paying = true;
    });
    builder.addCase(addPlintWholesaleOrderPayment.fulfilled, (s, { payload }) => {
      s.flags.paying = false;
      // payload: { ok, newBalance, newPrepayment, id }
      const id = payload?.id;
      if (s.current.data && s.current.data._id === id) {
        s.current.data.balance = payload.newBalance;
        s.current.data.prepayment = payload.newPrepayment;
        // totalSum не меняется
      }
    });
    builder.addCase(addPlintWholesaleOrderPayment.rejected, (s, { payload }) => {
      s.flags.paying = false;
      s.current.error = payload;
    });
  },
});

export const { resetCurrent } = slice.actions;
export default slice.reducer;

/* ------------ Selectors ------------ */
export const selectPlintWholesaleState = (s: any) => s.plintWholesaleOrder as PlintWholesaleOrderState;

export const selectWholesaleList = createSelector(
  selectPlintWholesaleState,
  (s) => s.list.items
);

export const selectWholesaleListLoading = createSelector(
  selectPlintWholesaleState,
  (s) => s.list.loading
);

export const selectWholesaleCurrent = createSelector(
  selectPlintWholesaleState,
  (s) => s.current.data
);

export const selectWholesaleCurrentLoading = createSelector(
  selectPlintWholesaleState,
  (s) => s.current.loading
);

export const selectWholesaleFlags = createSelector(
  selectPlintWholesaleState,
  (s) => s.flags
);
