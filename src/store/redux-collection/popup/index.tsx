import { popupSliceReducer } from "./popup.slice"

const combinedReducer = {
  ...popupSliceReducer
};

export * from "./popup.slice"
export default combinedReducer