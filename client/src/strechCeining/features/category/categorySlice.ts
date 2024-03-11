import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addCategory, getAllCategory } from "./categoryApi";

export interface Category {
    id: number;
    name: string;
}

export interface CategoryState {
    arrCategory: Array<Category>;
    category:  Category;
}

export const initialState: CategoryState = {
    arrCategory: [],
    category: {} as Category,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.category = action.payload;
            })
            .addCase(getAllCategory.fulfilled, (state, action) => {
                state.arrCategory = action.payload.category;
            });
    },
});

export const selectCategory = (state: { category: CategoryState }) => state.category;

export default categorySlice.reducer;
