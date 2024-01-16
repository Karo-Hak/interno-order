import { createSlice, } from "@reduxjs/toolkit";
import { addNewStretchOrder, findStretchOrder, findNewStretchOrder, searchStretchOrder, viewNewOrders } from "./stretchOrderApi";



export interface StretchOrder {
    id: string;
    height: number;
    weight: number;
    square: number;
   
}

export interface StretchOrderState {
    arrStretchOrder: Array<any>
    stretchOrder: StretchOrder;
}

export const initialState: StretchOrderState = {
    arrStretchOrder: [],
    stretchOrder: {} as StretchOrder
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
    }
})


export const selectStretchOrder = (state: any) => state.stretchOrder;

export default stretchOrderSlice.reducer;