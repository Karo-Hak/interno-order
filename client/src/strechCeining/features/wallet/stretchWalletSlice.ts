import { createSlice } from "@reduxjs/toolkit";
import { stretchWalletFindAll } from "./stretchWalletApi";


export interface StretchWalletProps {
    _id: string;
    type: string;
    amount: number;
}

export interface StretchWalletState {
    arrStretchWallet: Array<StretchWalletProps>;
    stretchWallet: StretchWalletProps
}
export const initialState: StretchWalletState = {
    arrStretchWallet: [],
    stretchWallet: {} as StretchWalletProps,

}
export const stretchWalletSlice = createSlice({
    name: "stretchWallet",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(stretchWalletFindAll.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchWallet = action.payload.stretchWallet
                }
            })
            // .addCase(getAllStretchTexture.fulfilled, (state, action) => {
            //     if ('error' in action.payload) {
            //     } else {
            //         state.arrDebetKredit = action.payload.DebetKredit
            //     }
            // })
    }
})


export const selectStretchWallet = (state: any) => state.stretchWallet;

export default stretchWalletSlice.reducer;