import Button from '@components/atoms/button'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostStrukturMutation } from '@store/redux-collection/dokumen'
import { useGetListParentStrukturQuery, useGetListRoleQuery, usePostRoleMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import { AnyObj } from '@type'
import _ from 'lodash'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const FormStrukturOrganisasi = ({ editData, onSuccess }: { editData?: AnyObj, onSuccess?: (props?: any) => void }) => {
  const dispatch = useDispatch()
  const { formTambahStruktur } = useSelector((state: IRootState) => state.dataForm.form)
  const [postRole, { isLoading }] = usePostStrukturMutation()
  const { data: struktur } = useGetListParentStrukturQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (editData) {
      dispatch(setDataForm({
        formName: "formTambahStruktur",
        formValue: {
          ..._.pick(editData, ["name", "parent_id", "is_child_node"]),
          extend: editData?.name?.includes?.("#extend")
        }
      }))
    }
  }, [])

  const onChangeGaris = (extend?: boolean) => {
    dispatch(setDataForm({
      formName: "formTambahStruktur",
      formValue: {
        ...formTambahStruktur?.formValue,
        extend: extend,
        name: extend ? "#extend" : "",
        is_child_node: false
      }
    }))
  }

  const onSubmit = () => {
    if (formTambahStruktur?.isValid) {
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
        formName: "formTambahStruktur",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    let newName = formTambahStruktur?.formValue?.extend ?
      _.find(struktur?.data, { id: formTambahStruktur?.formValue?.parent_id })?.name ?? ""
      : "";
    let input: AnyObj = {
      body: {
        ..._.omit(formTambahStruktur?.formValue, ["extend"]),
        name: formTambahStruktur?.formValue?.name + newName,
        is_child_node: formTambahStruktur?.formValue?.is_child_node ? 1 : 0
      }
    }
    if (editData?.id) input.id = editData.id

    dispatch(setIsLoadingPopup(true))
    postRole(input)
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
        formName="formTambahStruktur"
        extraData={{
          role: _.map(struktur?.data, idx => ({ "label": idx?.name, "value": idx?.id })),
        }}
        fieldGroup={[
          {
            "label": "Gunakan sebagai garis tambahan",
            "type": "checkbox",
            "name": "extend",
            "onChange": (extend) => onChangeGaris(extend)
            // "value": "#extend"
          },
          {
            "label": "Nama Organisasi",
            "type": "text",
            "name": "name",
            "placeholder": "Masukan Nama Organisasi",
            // "options": ({ extraData }) => extraData?.role,
            "disabled": (v) => v?.extend,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Struktur Induk",
            "type": "select",
            "name": "parent_id",
            "placeholder": "Pilih Struktur Induk",
            "options": ({ extraData }) => extraData?.role,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Child Node",
            "type": "checkbox",
            "name": "is_child_node",
            "disabled": (v) => v?.extend,
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

export default FormStrukturOrganisasi