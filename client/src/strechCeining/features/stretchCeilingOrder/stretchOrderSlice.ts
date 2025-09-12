import { createSlice, } from "@reduxjs/toolkit";
import { addNewStretchOrder, findStretchOrder, findNewStretchOrder, searchStretchOrder, viewNewOrders, updateStatuse, viewNewMesurOrders } from "./stretchOrderApi";
import { StretchBuyer } from "../StrechBuyer/strechBuyerSlice";



export interface StretchOrderProps {
    _id: string;
    balance: number;
    buyer: StretchBuyer;
    buyerComment: string;
    code: string;
    date: string;
    address: string;
    region: string;

}

export interface StretchOrderState {
    arrStretchOrder: Array<any>
    stretchOrder: StretchOrderProps;
}

export const initialState: StretchOrderState = {
    arrStretchOrder: [],
    stretchOrder: {} as StretchOrderProps
}

export const stretchOrderSlice = createSlice({
    name: "stretchOrder",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchOrder = action.payload
                }
            })

            .addCase(viewNewOrders.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchOrder = action.payload
                }

            })
            .addCase(findStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchOrder = action.payload
                }
            })

            .addCase(findNewStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchOrder = action.payload[0]
                }
            })
            .addCase(searchStretchOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchOrder = action.payload
                }
            })
            .addCase(updateStatuse.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchOrder = action.payload
                }
            })

    }
})


export const selectStretchOrder = (state: any) => state.stretchOrder;

export default stretchOrderSlice.reducer;