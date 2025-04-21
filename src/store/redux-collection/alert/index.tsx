import { alertSliceReducer } from "./alert.slice"

const combinedReducer = {
  ...alertSliceReducer,
};

export * from "./alert.slice"
export default combinedReducer