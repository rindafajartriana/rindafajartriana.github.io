import { kegiatanQueryReducer } from "./kegiatan.query"
import { kegiatanSliceReducer } from "./kegiatan.slice"

const combinedReducer = {
  ...kegiatanQueryReducer,
  ...kegiatanSliceReducer,
};

export * from "./kegiatan.query"
export * from "./kegiatan.slice"
export default combinedReducer