import { createSlice } from "@reduxjs/toolkit";

const reducerName = "dokument"
export const initialState = {
  data: {},
}

export const dokumentSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = dokumentSlice.actions

export const dokumentSliceReducer = {
  [reducerName]: dokumentSlice.reducer
}