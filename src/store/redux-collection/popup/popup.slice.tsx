import _ from "lodash";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Actions = {
  name?: string
  onClick?: (i?: number) => void
}

type PopupDataTypes = {
  title?: string
  type?: "success" | "danger" | "warning"
  id?: string
  stack?: boolean //default true
  content?: ((i?: number, isLoading?: boolean) => any) | string,
  preventClose?: boolean
  preventOutsideClose?: boolean
  containerClass?: string
  noButton?: boolean
  confirm?: Actions
  cancel?: Actions
  onClose?: () => any
  onEnter?: (index?: number) => void
}

type ImagePreviewTypes = {
  path: string
  label: string
}

export interface PopupTypes {
  data: PopupDataTypes[]
  imgPreview: ImagePreviewTypes[]
  defaultImgPreview?: string
  isLoading: boolean
}

const reducerName = "popup"
export const initialState = {
  data: [],
  imgPreview: [],
  defaultImgPreview: "",
  isLoading: false
} satisfies PopupTypes as PopupTypes

export const popupSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setPopup: (state, { payload }: PayloadAction<PopupDataTypes>) => {
      const isStack = payload?.stack ?? true
      const prevIndex: any = { payload: state.data?.length - 1 }
      if (!isStack) popupSlice.caseReducers.clearPopup(state, prevIndex)
      state.data = payload?.id && _.some(state.data, idx => idx?.id === payload?.id) ?
        state.data
        : [...state.data, payload]
    },
    clearPopup: (state, { payload }: PayloadAction<number | undefined>) => {
      // console.log("payload", payload)
      if (!payload) state.data = []
      else state.data.splice(payload, 1)
      state.isLoading = false
    },
    setIsLoadingPopup: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload
    },
    setPreviewImage: (state, { payload }: PayloadAction<{ list: ImagePreviewTypes[], default?: string }>) => {
      state.imgPreview = payload.list
      state.defaultImgPreview = payload.default
    },
    clearPreviewImage: (state) => {
      state.imgPreview = []
    }
  }
})

export const {
  setPopup, clearPopup, setIsLoadingPopup, setPreviewImage, clearPreviewImage
} = popupSlice.actions;

export const popupSliceReducer = {
  [reducerName]: popupSlice.reducer,
}
