import { baseMenuQueryReducer } from "./baseMenu.query"
import { baseMenuSliceReducer } from "./baseMenu.slice"

const combinedReducer = {
  ...baseMenuQueryReducer,
  ...baseMenuSliceReducer,
};

export * from "./baseMenu.query"
export * from "./baseMenu.slice"
export default combinedReducer