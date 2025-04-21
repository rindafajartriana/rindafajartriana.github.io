import { createSlice } from "@reduxjs/toolkit";

const reducerName = "masterData"
export const initialState = {
  data: {},
  dateExpire: "",
  path: ""
}

export const masterDataSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = masterDataSlice.actions

export const masterDataSliceReducer = {
  [reducerName]: masterDataSlice.reducer
}