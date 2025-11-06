import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import {
  createPlintRetailOrder,
  getPlintRetailOrderById,
  listPlintRetailOrdersByBuyer,
  updatePlintRetailOrder,
  addPlintRetailOrderPayment,
  RetailItem,
} from './plintRetailOrderApi';

export type PlintRetailOrderModel = {
  _id: string;
  buyer: string;
  items: RetailItem[];
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
  items: PlintRetailOrderModel[];
  loading: boolean;
  error?: any;
  // можно добавлять total/skip/limit если бэк будет отдавать
};

type CurrentState = {
  data?: PlintRetailOrderModel | null;
  loading: boolean;
  error?: any;
};

type FlagsState = {
  creating: boolean;
  updating: boolean;
  paying: boolean;
  canceling: boolean;
};

export type PlintRetailOrderState = {
  list: ListState;
  current: CurrentState;
  flags: FlagsState;
};

const initialState: PlintRetailOrderState = {
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
  name: 'plintRetailOrder',
  initialState,
  reducers: {
    // если нужно руками очистить current
    resetCurrent(state) {
      state.current = { data: null, loading: false, error: undefined };
    },
  },
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createPlintRetailOrder.pending, (s) => {
      s.flags.creating = true;
    });
    builder.addCase(createPlintRetailOrder.fulfilled, (s, { payload }) => {
      s.flags.creating = false;
      s.current.data = payload; // только что созданный заказ
      s.current.error = undefined;
    });
    builder.addCase(createPlintRetailOrder.rejected, (s, { payload }) => {
      s.flags.creating = false;
      s.current.error = payload;
    });

    // GET BY ID
    builder.addCase(getPlintRetailOrderById.pending, (s) => {
      s.current.loading = true;
      s.current.error = undefined;
    });
    builder.addCase(getPlintRetailOrderById.fulfilled, (s, { payload }) => {
      s.current.loading = false;
      s.current.data = payload;
    });
    builder.addCase(getPlintRetailOrderById.rejected, (s, { payload }) => {
      s.current.loading = false;
      s.current.error = payload;
    });

    // LIST BY BUYER
    builder.addCase(listPlintRetailOrdersByBuyer.pending, (s) => {
      s.list.loading = true;
      s.list.error = undefined;
    });
    builder.addCase(listPlintRetailOrdersByBuyer.fulfilled, (s, { payload }) => {
      s.list.loading = false;
      s.list.items = Array.isArray(payload) ? payload : [];
    });
    builder.addCase(listPlintRetailOrdersByBuyer.rejected, (s, { payload }) => {
      s.list.loading = false;
      s.list.error = payload;
    });

    // UPDATE
    builder.addCase(updatePlintRetailOrder.pending, (s) => {
      s.flags.updating = true;
    });
    builder.addCase(updatePlintRetailOrder.fulfilled, (s, { payload }) => {
      s.flags.updating = false;
      // payload: { ok: true, id }
      const id = payload?.id as string | undefined;
      if (id && s.current.data && s.current.data._id === id) {
        // после обновления — можно инициировать повторную загрузку на уровне компонента
        // либо оставить как есть и доверять данным из формы
      }
    });
    builder.addCase(updatePlintRetailOrder.rejected, (s, { payload }) => {
      s.flags.updating = false;
      s.current.error = payload;
    });

    // ADD PAYMENT
    builder.addCase(addPlintRetailOrderPayment.pending, (s) => {
      s.flags.paying = true;
    });
    builder.addCase(addPlintRetailOrderPayment.fulfilled, (s, { payload }) => {
      s.flags.paying = false;
      // payload: { ok, newBalance, newPrepayment, id }
      const id = payload?.id;
      if (s.current.data && s.current.data._id === id) {
        s.current.data.balance = payload.newBalance;
        s.current.data.prepayment = payload.newPrepayment;
        // totalSum не меняется
      }
    });
    builder.addCase(addPlintRetailOrderPayment.rejected, (s, { payload }) => {
      s.flags.paying = false;
      s.current.error = payload;
    });
  },
});

export const { resetCurrent } = slice.actions;
export default slice.reducer;

/* ------------ Selectors ------------ */
export const selectPlintRetailState = (s: any) => s.plintRetailOrder as PlintRetailOrderState;

export const selectRetailList = createSelector(
  selectPlintRetailState,
  (s) => s.list.items
);

export const selectRetailListLoading = createSelector(
  selectPlintRetailState,
  (s) => s.list.loading
);

export const selectRetailCurrent = createSelector(
  selectPlintRetailState,
  (s) => s.current.data
);

export const selectRetailCurrentLoading = createSelector(
  selectPlintRetailState,
  (s) => s.current.loading
);

export const selectRetailFlags = createSelector(
  selectPlintRetailState,
  (s) => s.flags
);
