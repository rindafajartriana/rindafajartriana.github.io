import { globalSliceReducer } from "./global.slice"

const combinedReducer = {
  ...globalSliceReducer,
};

export * from "./global.slice"
export default combinedReducer