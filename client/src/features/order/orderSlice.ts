import { createSlice, } from "@reduxjs/toolkit";
import { addNewOrder, findNewOrder, findOrder, searchOrder, updateOrder, viewNewOrders } from "./orderApi";



export interface Order {
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

export interface OrderState {
    arr: Array<any>
    order: Order;
}

export const initialState: OrderState = {
    arr: [],
    order: {} as Order
}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload
                }
            })

            .addCase(viewNewOrders.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arr = action.payload
                }

            })
            .addCase(findOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload
                }
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arr = action.payload
                }
            })
            .addCase(findNewOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.order = action.payload[0]
                }
            })
            .addCase(searchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arr = action.payload
                }
            })
    }
})


export const selectOrder = (state: any) => state.order;

export default orderSlice.reducer;