import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { SectionList } from '@pages/training/_dist'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostSoalMutation } from '@store/redux-collection/history-laporan'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FormSoal = ({ editData, onSuccess }) => {
  const dispatch = useDispatch()
  const { formSoal } = useSelector((state: IRootState) => state.dataForm.form)
  const [postSoal, { isLoading }] = usePostSoalMutation()

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formSoal",
        formValue: _.omit(editData, ["id"])
      }))
    }
  }, [editData])

  const onSubmit = () => {
    if (formSoal?.isValid) {
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
        formName: "formSoal",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    const input = {
      ...formSoal?.formValue,
      section_name: _.find(SectionList, { section_id: formSoal?.formValue?.section_id })?.section_name,
      idx: Number(formSoal?.formValue?.idx),
      has_photo: Number(formSoal?.formValue?.has_photo),
      status: 1
    }
    dispatch(setIsLoadingPopup(true))
    postSoal({ body: input, id: editData?.id })
      .unwrap()
      .then((res) => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
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
        formName="formSoal"
        extraData={{ optSection: _.map(SectionList, x => ({ label: x?.section_name, value: x?.section_id })) }}
        fieldGroup={[
          {
            "label": "Section",
            "type": "select",
            "name": "section_id",
            "placeholder": "Pilih Section",
            "options": ({ extraData }) => extraData?.optSection,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Urutan",
            "type": "number",
            "name": "idx",
            "placeholder": "Masukan Urutan",
            "validation": {
              isRequired: true,
              invalid: ({ value }) => Number(value) < 1
            }
          },
          {
            "label": "Soal",
            "type": "text",
            "name": "soal",
            "placeholder": "Masukan Soal",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Jawaban",
            "type": "textarea",
            "name": "jawaban",
            "placeholder": "Masukan Jawaban",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Bisa tambahkan photo",
            "type": "checkbox",
            "name": "has_photo",
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

export default FormSoal