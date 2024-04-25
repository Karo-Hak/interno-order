import { createSlice } from "@reduxjs/toolkit";


export interface DebetKredit {
    _id: string;
    type: string;
    amount: number;
}

export interface DebetKreditState {
    arrDebetKredit: Array<DebetKredit>;
    DebetKredit: DebetKredit
}
export const initialState: DebetKreditState = {
    arrDebetKredit: [],
    DebetKredit: {} as DebetKredit,

}
export const debetKreditSlice = createSlice({
    name: "debetKredit",
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


export const selectDebetKredit = (state: any) => state.debetKredit;

export default debetKreditSlice.reducer;