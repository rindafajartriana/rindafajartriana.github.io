import { masterDataQueryReducer } from "./masterData.query"
import { masterDataSliceReducer } from "./masterData.slice"

const combinedReducer = {
  ...masterDataQueryReducer,
  ...masterDataSliceReducer,
};

export * from "./masterData.query"
export * from "./masterData.slice"
export default combinedReducer