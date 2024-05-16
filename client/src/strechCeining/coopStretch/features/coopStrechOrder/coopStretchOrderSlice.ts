import { createSlice, } from "@reduxjs/toolkit";
import { addNewCoopStretchOrder, findCoopStretchOrder, findNewCoopStretchOrder, searchCoopStretchOrder, viewNewCoopStretchOrder } from "./coopStretchOrderApi";
import { CoopStretchBuyerProps } from "../coopStrechBuyer/coopStrechBuyerSlice";

export interface CoopStretchTextureProps {
    id: string;
    name: string;
    price: number;
    width: number;
    height: number;
    quantity: number;
    sum: number;
    type: string
}
export interface CoopStretchProfilProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sum: number;
    type: string
}
export interface CoopLightPlatformProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sum: number;
    type: string
}
export interface CoopLightRingProps {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sum: number;
    type: string
}

export interface CoopStretchOrderProps {
    _id: string;
    date: string;
    groupedStretchTextureData: Array<CoopStretchTextureProps>;
    groupedStretchProfilData: Array<CoopStretchProfilProps>;
    groupedLightPlatformData: Array<CoopLightPlatformProps>;
    groupedLightRingData: Array<CoopLightRingProps>;
    balance: number;
    prepayment: number;
    groundTotal: number;
    buyerComment: string;
    picCode: string;
    picUrl: string;
    payed: boolean;
    paymentMethod: string;
    buyer: CoopStretchBuyerProps;
    user: object
}



export interface CoopStretchOrderState {
    arrCoopStretchOrder: Array<any>
    coopStretchOrder: CoopStretchOrderProps;
}

export const initialState: CoopStretchOrderState = {
    arrCoopStretchOrder: [],
    coopStretchOrder: {} as CoopStretchOrderProps
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