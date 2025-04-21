import { dummyQueryReducer } from "./dummy.query"
import { dummySliceReducer } from "./dummy.slice"

const combinedReducer = {
  ...dummyQueryReducer,
  ...dummySliceReducer,
};

export * from "./dummy.query"
export * from "./dummy.slice"
export default combinedReducer