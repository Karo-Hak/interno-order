import { createSlice } from "@reduxjs/toolkit";
import { getAllTexture, newTexture } from "./textureApi";


export interface Texture {
    _id: string;
    name: string;
    price: number;

}

export interface TextureState {
    arrTexture: Array<Texture>;
    texture: Texture
}
export const initialState: TextureState = {
    arrTexture: [],
    texture: {} as Texture,

}
export const textureSlice = createSlice({
    name: "texture",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(newTexture.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.texture = action.payload
                }
            })
            .addCase(getAllTexture.fulfilled, (state, action) => {
                if ('error' in action.payload) {
                } else {
                    state.arrTexture = action.payload
                }
            })
    }
})


export const selectTexture = (state: any) => state.texture;

export default textureSlice.reducer;