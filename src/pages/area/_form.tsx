import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostAreaMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FormArea = ({ onSuccess, editData }) => {
  const dispatch = useDispatch()
  const { formTambahArea } = useSelector((state: IRootState) => state.dataForm.form)
  const [postArea, { isLoading }] = usePostAreaMutation()

  useEffect(() => {
      if (editData) {
        dispatch(setDataForm({
          formName: "formTambahArea",
          formValue: editData
        }))
      }
    }, [editData])

  const onSubmit = () => {
    if (formTambahArea?.isValid) {
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
        formName: "formTambahArea",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postArea({
      body: formTambahArea?.formValue,
      id: editData?.id
    })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: `Berhasil ${editData?.id ? "mengubah" : "menambahkan"} data area`,
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
        formName="formTambahArea"
        fieldGroup={[
          {
            "label": "Nama Area",
            "type": "text",
            "name": "name",
            "placeholder": "Masukan Nama Area",
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

export default FormArea