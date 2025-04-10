import { combineReducers } from "@reduxjs/toolkit";
import alertReducer from "./alert";
import globalReducer from "./global";
import signInReducer, { signInAPI } from "@store/redux-collection/sign-in";
import baseMenuReducer, { baseMenuAPI } from "@store/redux-collection/base-menu";
import popupReducer from "./popup";
import dataGridReducer from "./data-grid";
import dummyReducer, { dummyAPI } from "@store/redux-collection/dummy";
import masterDataReducer, { masterDataAPI } from "./master-data";
import pesanReducer, { pesanAPI } from "./pesan";
import kegiatanReducer, { kegiatanAPI } from "./kegiatan";
import dataFormReducer from "./data-form";
import historyLaporanReducer, { historyLaporanAPI } from "@store/redux-collection/history-laporan";
import dokumentReducer, { dokumentAPI } from "@store/redux-collection/dokumen";

export const combinedReducer = combineReducers({
  ...globalReducer,
  ...alertReducer,
  ...signInReducer,
  ...baseMenuReducer,
  ...popupReducer,
  ...dataGridReducer,
  ...dummyReducer,
  ...masterDataReducer,
  ...pesanReducer,
  ...kegiatanReducer,
  ...dataFormReducer,
  ...historyLaporanReducer,
  ...dokumentReducer
})
export type IRootState = ReturnType<typeof combinedReducer>

export const combinedMiddleware = [
  signInAPI.middleware,
  baseMenuAPI.middleware,
  dummyAPI.middleware,
  masterDataAPI.middleware,
  pesanAPI.middleware,
  kegiatanAPI.middleware,
  historyLaporanAPI.middleware,
  dokumentAPI.middleware
]