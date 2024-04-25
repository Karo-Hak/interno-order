import { createSlice } from "@reduxjs/toolkit";


export interface CoopDebetKreditProps {
    _id: string;
    type: string;
    amount: number;
}

export interface CoopDebetKreditState {
    arrCoopDebetKredit: Array<CoopDebetKreditProps>;
    coopDebetKredit: CoopDebetKreditProps
}
export const initialState: CoopDebetKreditState = {
    arrCoopDebetKredit: [],
    coopDebetKredit: {} as CoopDebetKreditProps,

}
export const coopDebetKreditSlice = createSlice({
    name: "coopDebetKredit",
    initialState,
    reducers: {

    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(addStretchTexture.fulfilled, (state, action) => {
    //             if ('error' in action.payload) {
    //             } else {
    //                 state.DebetKredit = action.payload
    //             }
    //         })
    //         .addCase(getAllStretchTexture.fulfilled, (state, action) => {
    //             if ('error' in action.payload) {
    //             } else {
    //                 state.arrDebetKredit = action.payload.DebetKredit
    //             }
    //         })
    // }
})


export const selectCoopDebetKredit = (state: any) => state.coopDebetKredit;

export default coopDebetKreditSlice.reducer;