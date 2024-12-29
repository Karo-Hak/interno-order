import { createSlice } from "@reduxjs/toolkit";


export interface PlintDebetKredit {
    _id: string;
    type: string;
    amount: number;
}

export interface PlintDebetKreditState {
    arrPlintDebetKredit: Array<PlintDebetKredit>;
    plintDebetKredit: PlintDebetKredit
}
export const initialState: PlintDebetKreditState = {
    arrPlintDebetKredit: [],
    plintDebetKredit: {} as PlintDebetKredit,

}
export const plintDebetKreditSlice = createSlice({
    name: "plintDebetKredit",
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


export const selectPlintDebetKredit = (state: any) => state.plintDebetKredit;

export default plintDebetKreditSlice.reducer;