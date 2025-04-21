import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { useGetListUserQuery, usePostJabatanMutation } from '@store/redux-collection/master-data'
import { usePostPesanMutation } from '@store/redux-collection/pesan'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

const FormPesan = ({ onSuccess }) => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state: IRootState) => state.signIn.data)
  const { formPesan } = useSelector((state: IRootState) => state.dataForm.form)
  const { data, isFetching, refetch } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })

  const [postPesan, { isLoading }] = usePostPesanMutation()

  const onSubmit = () => {
    if (formPesan?.isValid) {
      dispatch(setPopup({
        title: "Konfirmasi",
        type: "warning",
        content: "Apakah data yang anda input sudah benar ?",
        confirm: {
          name: "Ya, Kirim",
          onClick: () => handleSubmit()
        },
        cancel: {
          name: "Batal"
        }
      }))
    } else {
      dispatch(setDataForm({
        formName: "formPesan",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postPesan({ ...formPesan?.formValue, from: userInfo?.id })
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
        formName="formPesan"
        extraData={{
          optionsUser: _.map(data?.data, x => ({ label: x?.fullname, value: x?.id }))
        }}
        fieldGroup={[
          {
            "label": "Tujuan",
            "type": "select",
            "name": "to",
            "placeholder": "Pilih Tujuan",
            "options": ({ extraData }) => extraData?.optionsUser,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Judul",
            "type": "text",
            "name": "judul",
            "placeholder": "Masukan Judul",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Pesan",
            "type": "textarea",
            "name": "isi",
            "placeholder": "Masukan Pesan",
            "validation": {
              isRequired: true
            }
          },
        ]}
      />
      <hr className="my-4" />
      <Button className="btn color-primary w-full"
        onClick={() => onSubmit()}
      >Kirim</Button>
    </div>
  )
}

export default FormPesan