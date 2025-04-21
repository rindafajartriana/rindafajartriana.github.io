import { pesanQueryReducer } from "./pesan.query"
import { pesanSliceReducer } from "./pesan.slice"

const combinedReducer = {
  ...pesanQueryReducer,
  ...pesanSliceReducer,
};

export * from "./pesan.query"
export * from "./pesan.slice"
export default combinedReducer