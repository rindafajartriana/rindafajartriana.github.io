import { signInQueryReducer } from "./signIn.query"
import { signInSliceReducer } from "./signIn.slice"

const combinedReducer = {
  ...signInQueryReducer,
  ...signInSliceReducer,
};

export * from "./signIn.query"
export * from "./signIn.slice"
export default combinedReducer