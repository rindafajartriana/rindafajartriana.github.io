import { createSlice } from "@reduxjs/toolkit";

const reducerName = "global"
export const initialState = {
  rowData: {},
}

export const globalSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setRowData: (state: any, { payload }) => {
      state.rowData = payload
    }
  }
})

export const { setRowData, resetRowData }: any = globalSlice.actions

export const globalSliceReducer = {
  [reducerName]: globalSlice.reducer
}