import _ from "lodash";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnyObj } from "@type";

export const enum FormCollection {
  formTambahAnggota = "formTambahAnggota",
  formTambahAdmin = "formTambahAdmin",
  formTambahRole = "formTambahRole",
  formTambahJabatan = "formTambahJabatan",
  formTambahArea = "formTambahArea",
  formTambahDepartment = "formTambahDepartment",
  formTambahKegiatan = "formTambahKegiatan",
  formTps = "formTps",
  formPesan = "formPesan",
  formSoal = "formSoal",
  formTambahStruktur = "formTambahStruktur",
  formTambahRoleAnggota = "formTambahRoleAnggota",
}

type FormType = {
  formValue?: AnyObj
  isValid?: boolean
  isCheckValidate?: boolean
}

type ActionFormType = {
  formName: `${FormCollection}`
} & FormType

export type FormObjType = {
  [i in FormCollection]?: FormType
}

export type DataFormType = {
  form: FormObjType
}

const reducerName = "dataForm"
export const initialState: DataFormType = {
  form: {}
}

export const dataFormSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setDataForm: (state, { payload }: PayloadAction<ActionFormType>) => {
      state.form = {
        ...state.form,
        [payload.formName]: {
          ...state?.form?.[payload.formName],
          // formValue: payload.formValue ?? state?.form?.[payload.formName]?.formValue,
          ...payload
        }
      }
    },
    clearCurrentDataForm: (state, { payload }: PayloadAction<ActionFormType>) => {
      state.form = {
        ..._.omit(state.form, [payload.formName])
      }
    },
  }
})

export const {
  setDataForm,
  clearCurrentDataForm
} = dataFormSlice.actions;

export const dataFormSliceReducer = {
  [reducerName]: dataFormSlice.reducer,
}