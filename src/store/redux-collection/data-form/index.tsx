import { dataFormSliceReducer } from "./dataForm.slice"

const combinedReducer = {
  ...dataFormSliceReducer
};

export * from "./dataForm.slice"
export default combinedReducer