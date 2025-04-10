import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { EditData } from '@pages/data-anggota/_form'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { useGetListDepartmentQuery, useGetListJabatanQuery, useGetListRoleQuery, usePostUserMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FormAdmin = ({
  editData,
  onSuccess
}: EditData) => {
  const dispatch = useDispatch()
  const { formTambahAdmin } = useSelector((state: IRootState) => state.dataForm.form)
  const [postUser, { isLoading }] = usePostUserMutation()
  const { data: role } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })
  const { data: department } = useGetListDepartmentQuery({}, { refetchOnMountOrArgChange: true })

  const onSubmit = () => {
    if (formTambahAdmin?.isValid) {
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
        formName: "formTambahAdmin",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postUser({
      body: {
        ...formTambahAdmin?.formValue,
        password: formTambahAdmin?.formValue?.password ? formTambahAdmin?.formValue?.password : undefined
        // role_id: 1,
        // jabatan_id: 1
      },
      id: editData?.id,
      type: "admin"
    })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: `Berhasil ${editData? "mengubah" : "menambahkan"} data administrator`,
          onClose: () => onSuccess?.()
        })))
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

    useEffect(() => {
      if (editData) {
        dispatch(setDataForm({
          formName: "formTambahAdmin",
          formValue: _.omit(editData, ["is_verification", "is_active", "jabatan"])
        }))
      } 
    }, [editData])

  return (
    <div>
      <GlobalFormReducer
        formName="formTambahAdmin"
        extraData={{
          role: _.map(_.filter(role?.data, x => (x.access_type === "SU") || (x.access_type === "PENGURUS")), idx => ({ "label": idx?.role, "value": idx?.id })),
          department: _.map(department?.data, idx => ({ "label": idx?.department, "value": idx?.id })),
        }}
        fieldGroup={[
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
            "label": "Posisi",
            "type": "select",
            "name": "role_id",
            "placeholder": "Pilih Posisi",
            "options": ({ extraData }) => extraData?.role,
            "validation": {
              isRequired: true
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
            "label": "Kata Sandi",
            "type": "password",
            "name": "password",
            "placeholder": "Masukan Kata Sandi",
            "validation": {
              isRequired: true && !editData
            }
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

export default FormAdmin