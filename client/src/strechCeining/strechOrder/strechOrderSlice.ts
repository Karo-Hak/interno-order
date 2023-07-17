import { createSlice, } from "@reduxjs/toolkit";
import { addNewStrechOrder, findNewStrechOrder, findStrechOrder, searchStrechOrder, viewNewStrechOrder } from "./strechOrderApi";



export interface StrechOrder {
    id: string;
    height: number;
    weight: number;
    square: number;
    discount: number;
    total: number;
    prepayment: number;
    picCode: string;
    picUrl: string;
    cooperateTotal: number;
    kontragent: string;
    texture: string;
    paymentMethod: string
}

export interface StrechOrderState {
    arr: Array<any>
    order: StrechOrder;
}

export const initialState: StrechOrderState = {
    arr: [],
    order: {} as StrechOrder
}

export const strechOrderSlice = createSlice({
    name: "strechOrder",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewStrechOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload
                }
            })

            .addCase(viewNewStrechOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arr = action.payload
                }

            })
            .addCase(findStrechOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload
                }
            })
            .addCase(findNewStrechOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload[0]
                }
            })
            .addCase(searchStrechOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arr = action.payload
                }
            })
    }
})


export const selectStrechOrder = (state: any) => state.strechOrder;

export default strechOrderSlice.reducer;