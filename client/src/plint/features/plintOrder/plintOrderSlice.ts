import { createSlice, } from "@reduxjs/toolkit";
import { PlintBuyerProps } from "../plintBuyer/plintBuyerSlice";
import { addNewPlintOrder, findNewPlintOrder, findPlintOrder, searchPlintOrder, viewNewPlintOrder } from "./plintOrderApi";
import { User } from "../../../features/user/userSlice";


export interface GroupedPlintDataProps {

    id: string;
    name: string;
    price1: string;
    price2: string;
    quantity: string;
    sum: number;
}


export interface PlintOrderProps {
    _id: string;
    groupedPlintData: Array<GroupedPlintDataProps>;
    date: string;
    buyerComment: string;
    balance: number;
    coopDiscount: number;
    code: string;
    delivery: boolean;
    prepayment: number;
    deliverySum: number;
    groundTotal: number;
    paymentMethod: string;
    done: boolean;
    buyer: PlintBuyerProps;
    user: User;
    coopTotal: number;
    sum: number;
    discount: number;
    deliveryAddress: string;
    deliveryPhone: string;

}



export interface PlintOrderState {
    arrPlintOrder: Array<any>
    plintOrder: PlintOrderProps;
}

export const initialState: PlintOrderState = {
    arrPlintOrder: [],
    plintOrder: {} as PlintOrderProps
}

export const plintOrderSlice = createSlice({
    name: "plintOrder",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewPlintOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintOrder = action.payload
                }
            })

            .addCase(viewNewPlintOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintOrder = action.payload
                }

            })
            .addCase(findPlintOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintOrder = action.payload
                }
            })
            .addCase(findNewPlintOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plintOrder = action.payload[0]
                }
            })
            .addCase(searchPlintOrder.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlintOrder = action.payload
                }
            })
    }
})


export const selectPlintOrder = (state: any) => state.plintOrder;

export default plintOrderSlice.reducer;