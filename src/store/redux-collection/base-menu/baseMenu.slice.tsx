import { createSlice } from "@reduxjs/toolkit";

const reducerName = "baseMenu"
export const initialState = {
  data: {},
  dateExpire: "",
  path: ""
}

export const baseMenuSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = baseMenuSlice.actions

export const baseMenuSliceReducer = {
  [reducerName]: baseMenuSlice.reducer
}