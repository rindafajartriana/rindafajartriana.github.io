import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostDepartmentMutation, usePostRoleMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import { AnyObj } from '@type'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FormDepartment = ({ onSuccess, editData }) => {
  const dispatch = useDispatch()
  const { formTambahDepartment } = useSelector((state: IRootState) => state.dataForm.form)
  const [postDepartment, { isLoading }] = usePostDepartmentMutation()

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formTambahDepartment",
        formValue: editData
      }))
    }
  }, [editData])


  const onSubmit = () => {
    if (formTambahDepartment?.isValid) {
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
        formName: "formTambahDepartment",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postDepartment({
      body: formTambahDepartment?.formValue,
      id: editData?.id
    })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: `Berhasil ${editData?.id ? "mengubah" : "menambahkan"} data department`,
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

  return (
    <div>
      <GlobalFormReducer
        formName="formTambahDepartment"
        fieldGroup={[
          {
            "label": "Nama Department",
            "type": "text",
            "name": "department",
            "placeholder": "Masukan Nama Department",
            "validation": {
              isRequired: true
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

export default FormDepartment