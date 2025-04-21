import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostKegiatanMutation } from '@store/redux-collection/kegiatan'
import { useGetListRoleQuery } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import { AnyObj } from '@type'
import _ from 'lodash'
import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const optParticipant = [
  {
    label: "Semua",
    value: "semua"
  },
  {
    label: "Pengurus",
    value: "SU"
  },
  {
    label: "Anggota",
    value: "ANGGOTA"
  },
]

interface FormKegiatanType {
  dateSelected?: string
  onSuccess: () => void
  editData?: any
}
const FormKegiatan = ({
  dateSelected,
  onSuccess,
  editData
}: FormKegiatanType) => {
  const dispatch = useDispatch()
  const [postKegiatan, { isLoading: isLoadingKegiatan }] = usePostKegiatanMutation()
  const { formTambahKegiatan } = useSelector((state: IRootState) => state.dataForm.form)
  const { data: role } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formTambahKegiatan",
        formValue: _.pick(editData, ["nama_kegiatan", "keterangan"])
      }))
    }
  }, [editData])


  const onSubmit = () => {
    if (formTambahKegiatan?.isValid) {
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
        formName: "formTambahKegiatan",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    const rectRole = formTambahKegiatan?.formValue?.recipient_roles
    const participant = (rectRole === "semua") ? role?.data
      : rectRole === "SU" ? _.filter(role?.data, x => (x?.access_type === "SU") || (x?.access_type === "PENGURUS"))
        : _.filter(role?.data, x => (x?.access_type === "ANGGOTA"))
    postKegiatan({
      body: {
        ...formTambahKegiatan?.formValue,
        tanggal: moment(dateSelected, "DD-MM-YYYY").format("YYYY-MM-DD"),
        recipient_roles: _.map(participant, x => x?.id)
      },
      id: editData?.id
    })
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
        formName="formTambahKegiatan"
        extraData={{ optParticipant: optParticipant }}
        fieldGroup={[
          // {
          //   "label": "No",
          //   "type": "text",
          //   "name": "kode",
          //   "placeholder": "Masukan Nomor Kegiatan",
          //   "validation": {
          //     isRequired: true
          //   },
          //   disabled: true
          // },
          {
            "label": "Nama Kegiatan",
            "type": "text",
            "name": "nama_kegiatan",
            "placeholder": "Masukan Nama kegiatan",
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Pilih Participant",
            "type": "select",
            "name": "recipient_roles",
            "placeholder": "Pilih participant",
            "validation": {
              isRequired: true
            },
            "options": ({ extraData }) => extraData?.optParticipant
          },
          {
            "label": "Keterangan",
            "type": "textarea",
            "name": "keterangan",
            "placeholder": "Masukan keterangan",
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

export default FormKegiatan