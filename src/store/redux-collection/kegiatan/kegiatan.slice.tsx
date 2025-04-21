import { createSlice } from "@reduxjs/toolkit";

const reducerName = "kegiatan"
export const initialState = {
  data: {},
}

export const kegiatanSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {}
})

export const { }: any = kegiatanSlice.actions

export const kegiatanSliceReducer = {
  [reducerName]: kegiatanSlice.reducer
}