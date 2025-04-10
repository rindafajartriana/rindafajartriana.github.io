import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { useGetListDepartmentQuery, useGetListJabatanQuery, useGetListRoleQuery, useGetListUserQuery, usePostUserMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import { setToken } from '@store/redux-collection/sign-in'
import { AnyObj } from '@type'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export interface EditData {
  editData?: AnyObj
  onSuccess: () => void
  isProfile?: boolean
}

const FormAnggota = ({
  editData,
  onSuccess,
  isProfile = false
}: EditData) => {
  const dispatch = useDispatch()
  const { data } = useGetListUserQuery({ sortBy: "user_code", sortType: "DESC", limit: 1 }, { refetchOnMountOrArgChange: true })
  const { token, userInfo } = useSelector((state: IRootState) => state.signIn.data)

  const { formTambahAnggota } = useSelector((state: IRootState) => state.dataForm.form)
  const [postUser, { isLoading }] = usePostUserMutation()
  const { data: department } = useGetListDepartmentQuery({}, { refetchOnMountOrArgChange: true })
  const { data: jabatan } = useGetListJabatanQuery({}, { refetchOnMountOrArgChange: true })
  const { data: role } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formTambahAnggota",
        formValue: _.omit(editData, ["is_verification", "is_active", "jabatan", "role", "department"])
      }))
    } else {
      dispatch(setDataForm({
        formName: "formTambahAnggota",
        formValue: { is_verification: 1, is_active: 1 }
      }))
    }
  }, [editData])

  const onSubmit = () => {
    if (formTambahAnggota?.isValid) {
      // console.log("FORM", formTambahAnggota?.formValue)
      dispatch(setPopup({
        title: "Konfirmasi",
        type: "warning",
        content: "Apakah data yang anda input sudah benar ?",
        confirm: {
          name: "Ya, Simpan",
          onClick: () => handleSubmit()
        },
        cancel: {
          name: "Batal"
        }
      }))
    } else {
      dispatch(setDataForm({
        formName: "formTambahAnggota",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postUser({
      body: {
        ...formTambahAnggota?.formValue,
        password: formTambahAnggota?.formValue?.password ? formTambahAnggota?.formValue?.password : undefined
      }, id: editData?.id
    })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: "Berhasil menambahkan data anggota",
          onClose: () => onSuccess?.()
        })))
        if (editData?.id === userInfo?.id) {
          dispatch(setToken({
            data: {
              token: token,
              userInfo: {
                ...userInfo,
                ..._.omit(formTambahAnggota?.formValue, "password")
              }
            }
          }))
        }
      })
      .catch((err) => {
        dispatch(clearPopup(-1))
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
      .finally(() => {
        dispatch(setIsLoadingPopup(false))
      })
  }

  return (
    <div>
      <GlobalFormReducer
        formName="formTambahAnggota"
        extraData={{
          accessType: userInfo?.access_type,
          department: _.map(department?.data, idx => ({ "label": idx?.department, "value": idx?.id })),
          jabatan: _.map(jabatan?.data, idx => ({ "label": idx?.jabatan, "value": idx?.id })),
          role: _.map(_.filter(role?.data, x => (x?.access_type === "ANGGOTA") || (isProfile && (x?.access_type === editData?.access_type))), idx => ({ "label": idx?.role, "value": idx?.id })),
        }}
        fieldGroup={[
          // {
          //   "label": "Kode Anggota",
          //   "type": "text",
          //   "name": "user_code",
          //   "disabled": true,
          //   "note": "* Otomatis terisi"
          // },
          {
            "label": "Nomor Induk Anggota",
            "type": "text",
            "name": "nik",
            "placeholder": "Masukan NIK",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Nama Lengkap",
            "type": "text",
            "name": "fullname",
            "placeholder": "Masukan Nama Lengkap",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Nama Pengguna",
            "type": "text",
            "name": "username",
            "placeholder": "Masukan Nama Pengguna",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Kata Sandi",
            "type": "password",
            "name": "password",
            "placeholder": "Masukan Kata Sandi",
            "validation": {
              isRequired: true && !editData
            }
          },
          {
            "label": "Department",
            "type": "select",
            "name": "department_id",
            "placeholder": "Pilih Department",
            "options": ({ extraData }) => extraData?.department,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Jabatan",
            "type": "select",
            "name": "jabatan_id",
            "placeholder": "Pilih Jabatan",
            "options": ({ extraData }) => extraData?.jabatan,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Posisi",
            "type": "select",
            "name": "role_id",
            "placeholder": "Pilih Posisi",
            "options": ({ extraData }) => extraData?.role,
            "validation": {
              isRequired: true
            },
            disabled: (v, { extraData }) => extraData?.accessType !== "SU" && extraData?.accessType !== "ADMIN"
          },
        ]}
      />
      <hr className="my-4" />
      <Button className="btn color-primary w-full"
        onClick={() => onSubmit()}
      >Simpan</Button>
    </div>
  )
}

export default FormAnggota