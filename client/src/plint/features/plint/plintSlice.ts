import { createSlice } from "@reduxjs/toolkit";
import { getAllPlint, addNewPlint } from "./plintApi";


export interface PlintProps {
    _id: string;
    name: string;
    price: string;
    quantity: string;

}

export interface PlintState {
    arrPlint: Array<PlintProps>;
    plint: PlintProps
}
export const initialState: PlintState = {
    arrPlint: [],
    plint: {} as PlintProps,

}
export const plintSlice = createSlice({
    name: "plint",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewPlint.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.plint = action.payload
                }
            })
            .addCase(getAllPlint.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrPlint = action.payload
                }
            })
    }
})


export const selectPlint = (state: any) => state.plint;

export default plintSlice.reducer;