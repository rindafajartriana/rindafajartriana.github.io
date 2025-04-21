import { createSlice } from "@reduxjs/toolkit";

const reducerName = "historyLaporan"
export const initialState = {
  data: {},
}

export const historyLaporanSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = historyLaporanSlice.actions

export const historyLaporanSliceReducer = {
  [reducerName]: historyLaporanSlice.reducer
}