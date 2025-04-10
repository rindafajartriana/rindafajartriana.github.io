import _ from "lodash";
import { createSlice } from "@reduxjs/toolkit";

const reducerName = "dataGrid"
export const initialState = {
  propsGrid: {}
}

export const dataGridSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setPropsGrid: (state, { payload }) => {
      state.propsGrid = {
        ...state.propsGrid,
        [payload.id]: payload?.props
      }
    },
    setReloadGrid: (state, { payload }) => {
      state.propsGrid = {
        ...state.propsGrid,
        [payload]: {
          isReload: true
        }
      }
    },
    resetReloadGrid: (state, { payload }) => {
      state.propsGrid = {
        ...state.propsGrid,
        [payload]: {
          isReload: false
        }
      }
    },
    resetPropsGrid: (state, { payload }) => {
      state.propsGrid = _.omit(state.propsGrid, [payload])
    }
  }
})

export const {
  setPropsGrid,
  setReloadGrid,
  resetReloadGrid,
  resetPropsGrid
} = dataGridSlice.actions;

export const dataGridSliceReducer = {
  [reducerName]: dataGridSlice.reducer,
}
