import { createSlice } from "@reduxjs/toolkit";
import { AnyObj } from "@type";

interface signInSliceType {
  data: { token?: string, userInfo?: AnyObj }
  dateExpire?: string
  path?: string,
  register: any[]
}

const reducerName = "signIn"
export const initialState: signInSliceType = {
  data: {},
  dateExpire: "",
  path: "",
  register: []
};

export const signInSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.data = payload?.data
      state.path = payload?.path
    },
    setTimeRemain: (state, { payload }) => {
      state.dateExpire = payload?.date
    },
    signOut: (state) => {
      state.data = {}
      state.path = ""
    },
    setRegister: (state, { payload }) => {
      state.register = state.register?.length ? [...state.register, payload] : [payload]
    }
  }
});

export const { setToken, signOut, setTimeRemain, setRegister }: any = signInSlice.actions;

export const signInSliceReducer = {
  [reducerName]: signInSlice.reducer,
};