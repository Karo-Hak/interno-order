import { createSlice } from "@reduxjs/toolkit";
import { addStretchProfil, getAllStretchProfil } from "./strechProfilApi";


export interface StretchProfil {
    _id: string;
    name: string;
    price: number;
    unyt: string;
}

export interface StretchProfilState {
    arrStretchProfil: Array<StretchProfil>;
    stretchProfil: StretchProfil
}
export const initialState: StretchProfilState = {
    arrStretchProfil: [],
    stretchProfil: {} as StretchProfil,

}
export const stretchProfilSlice = createSlice({
    name: "stretchProfil",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addStretchProfil.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.stretchProfil = action.payload
                }
            })
            .addCase(getAllStretchProfil.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrStretchProfil = action.payload.stretchProfil
                }
            })
    }
})


export const selectStretchProfil = (state: any) => state.stretchProfil;

export default stretchProfilSlice.reducer;