import { dataGridSliceReducer } from "./dataGrid.slice"

const combinedReducer = {
  ...dataGridSliceReducer
};

export * from "./dataGrid.slice"
export default combinedReducer