import { createSlice } from "@reduxjs/toolkit";
import { addStretchProfil, getAllStretchProfil } from "./strechProfilApi";


export interface StretchProfilProps {
    _id: string;
    name: string;
    price: number;
    coopPrice: number;
}

export interface StretchProfilState {
    arrStretchProfil: Array<StretchProfilProps>;
    stretchProfil: StretchProfilProps
}
export const initialState: StretchProfilState = {
    arrStretchProfil: [],
    stretchProfil: {} as StretchProfilProps,

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