import { createSlice, } from "@reduxjs/toolkit";
import { addNewCoopStretchOrder, findCoopStretchOrder, findNewCoopStretchOrder, searchCoopStretchOrder, viewNewCoopStretchOrder } from "./coopStretchOrderApi";



export interface CoopStretchOrder {
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

export interface CoopStretchOrderState {
    arrCoopStretchOrder: Array<any>
    coopStretchOrder: CoopStretchOrder;
}

export const initialState: CoopStretchOrderState = {
    arrCoopStretchOrder: [],
    coopStretchOrder: {} as CoopStretchOrder
}

export const coopStretchOrderSlice = createSlice({
    name: "coopStretchOrder",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewCoopStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.coopStretchOrder = action.payload
                }
            })

            .addCase(viewNewCoopStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrCoopStretchOrder = action.payload
                }

            })
            .addCase(findCoopStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.coopStretchOrder = action.payload
                }
            })
            .addCase(findNewCoopStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.coopStretchOrder = action.payload[0]
                }
            })
            .addCase(searchCoopStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrCoopStretchOrder = action.payload
                }
            })
    }
})


export const selectCoopStretchOrder = (state: any) => state.coppStretchOrder;

export default coopStretchOrderSlice.reducer;