import { createSlice } from "@reduxjs/toolkit";

const reducerName = "alert"
export const initialState = {
  data: [],
  formValue: {},
  isLoading: false
}

export const alertSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setAlert: (state: any, { payload }) => {
      const obj = {
        id: state?.data?.length ? state.data[state?.data?.length - 1].id + 1 : 1,
        type: payload.type,
        messageType: payload?.messageType,
        message: typeof payload?.message === 'string' ? payload?.message
          : payload?.messageType === "json" ? payload?.message
            : payload?.messageType === "html" ? payload?.message
              : payload?.message?.error ?? payload?.message?.meta?.message ?? payload?.message?.data?.meta?.message ?? "something went wrong!",
        confirmButton: payload?.confirmButton ?? undefined,
        cancelButton: payload?.cancelButton ?? undefined,
        createdAt: Date.now()
      }
      state.data = [...state.data, obj]
    },
    setGlobalFormValue: (state: any, { payload }) => {
      state.formValue = ({ ...state.formValue, [payload.target.name]: payload.target.value })
    },
    setIsLoadingAlert: (state: any, { payload }) => {
      state.isLoading = payload
    },
    resetAlert: (state: any) => {
      state.data = []
    }
  }
})

export const { setAlert, resetAlert, setGlobalFormValue, setIsLoadingAlert }: any = alertSlice.actions

export const alertSliceReducer = {
  [reducerName]: alertSlice.reducer
}