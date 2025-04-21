import { createSlice } from "@reduxjs/toolkit";

const reducerName = "pesan"
export const initialState = {
  data: {},
}

export const pesanSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = pesanSlice.actions

export const pesanSliceReducer = {
  [reducerName]: pesanSlice.reducer
}