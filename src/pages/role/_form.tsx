import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostRoleMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { accesType } from './dummy'

const FormRole = ({ onSuccess, editData }) => {
  const dispatch = useDispatch()
  const { formTambahRole } = useSelector((state: IRootState) => state.dataForm.form)
  const [postRole, { isLoading }] = usePostRoleMutation()

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formTambahRole",
        formValue: editData
      }))
    }
  }, [editData])

  const onSubmit = () => {
    if (formTambahRole?.isValid) {
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
        formName: "formTambahRole",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postRole({
      body: formTambahRole?.formValue,
      id: editData?.id
    })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: `Berhasil ${editData?.id ? "mengubah" : "menambahkan"} data role`,
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
        formName="formTambahRole"
        extraData={{
          optAkses: _.map(accesType, x => ({ label: x, value: x }))
        }}
        fieldGroup={[
          {
            "label": "Nama Posisi",
            "type": "text",
            "name": "role",
            "placeholder": "Masukan Nama Posisi",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Tipe Akses",
            "type": "select",
            "name": "access_type",
            "placeholder": "Pilih tipe akses",
            "options": ({ extraData }) => extraData?.optAkses,
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

export default FormRole