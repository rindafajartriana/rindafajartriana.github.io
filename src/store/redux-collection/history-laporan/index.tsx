import { historyLaporanQueryReducer } from "./history-laporan.query"
import { historyLaporanSliceReducer } from "./history-laporan.slice"

const combinedReducer = {
  ...historyLaporanQueryReducer,
  ...historyLaporanSliceReducer,
};

export * from "./history-laporan.query"
export * from "./history-laporan.slice"
export default combinedReducer