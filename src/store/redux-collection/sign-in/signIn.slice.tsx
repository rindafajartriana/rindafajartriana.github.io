import { createSlice } from "@reduxjs/toolkit";
import { AnyObj } from "@type";

interface signInSliceType {
  data: { token?: string; userInfo?: AnyObj };
  dataCust: { token?: string; userInfo?: AnyObj };
  dateExpire?: string;
  dateExpireCust?: string;
  path?: string;
  pathCust?: string;
  register: any[];
}

const reducerName = "signIn";
export const initialState: signInSliceType = {
  data: {},
  dataCust: {},
  dateExpire: "",
  dateExpireCust: "",
  path: "",
  pathCust: "",
  register: [],
};

export const signInSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.data = payload?.data;
      state.path = payload?.path;
    },
    setTokenCust: (state, { payload }) => {
      state.dataCust = payload?.data;
      state.pathCust = payload?.path;
    },
    setTimeRemain: (state, { payload }) => {
      state.dateExpire = payload?.date;
    },
    setTimeRemainCust: (state, { payload }) => {
      state.dateExpireCust = payload?.date;
    },
    signOut: (state) => {
      state.data = {};
      state.path = "";
    },
    signOutCust: (state) => {
      state.dataCust = {};
      state.pathCust = "";
    },
    setRegister: (state, { payload }) => {
      state.register = state.register?.length
        ? [...state.register, payload]
        : [payload];
    },
  },
});

export const {
  setToken,
  setTokenCust,
  signOut,
  signOutCust,
  setTimeRemain,
  setTimeRemainCust,
  setRegister,
}: any = signInSlice.actions;

export const signInSliceReducer = {
  [reducerName]: signInSlice.reducer,
};
