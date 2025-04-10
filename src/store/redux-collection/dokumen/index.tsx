import { dokumentQueryReducer } from "./dokument.query"
import { dokumentSliceReducer } from "./dokument.slice"

const combinedReducer = {
  ...dokumentQueryReducer,
  ...dokumentSliceReducer,
};

export * from "./dokument.query"
export * from "./dokument.slice"
export default combinedReducer