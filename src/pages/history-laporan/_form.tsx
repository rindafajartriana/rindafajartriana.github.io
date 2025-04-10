import { CloseIcon } from '@assets/icons/_index'
import Button from '@components/atoms/button'
import Img from '@components/atoms/img'
import Input from '@components/atoms/input'
import Spinner from '@components/atoms/spinner'
import TextArea from '@components/atoms/textarea'
import GlobalFormReducer from '@components/organisms/globalFormReducer'
import { getErrorMessage } from '@helpers'
import { UploadProcess } from '@pages/training/_kuisioner'
import { IRootState } from '@store/redux-collection'
import { setDataForm } from '@store/redux-collection/data-form'
import { usePostLaporanMutation } from '@store/redux-collection/history-laporan'
import { useGetListAreaQuery, usePostJabatanMutation, usePostUploadPhotoMutation } from '@store/redux-collection/master-data'
import { clearPopup, setIsLoadingPopup, setPopup } from '@store/redux-collection/popup'
import _ from 'lodash'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const item = {
  "nama_item": "",
  "jumlah": null,
  "keterangan": "",
  "user_image_path": ""
}

const FormTPS = ({ onSuccess }) => {
  const dispatch = useDispatch()
  // const [img, setImg] = useState("")
  const { formTps } = useSelector((state: IRootState) => state.dataForm.form)
  const [postLaporan, { isLoading }] = usePostLaporanMutation()
  const [upload, { data: dataUpload, isLoading: isLoadingUplaod }] = usePostUploadPhotoMutation()
  const { data: area } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true })

  const [items, setItems] = useState([item])

  const onRemoveItem = (index: number) => {
    setItems(p => {
      let dup = [...p]
      dup?.splice?.(index, 1)
      return dup
    })
  }

  const onSubmit = () => {
    if (!formTps?.isValid || _.some(items, x => _.some(Object.values(x), ix => !ix))) {
      dispatch(setDataForm({
        formName: "formTps",
        isCheckValidate: true
      }))
    } else {
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
    }
  }

  const handleSubmit = () => {
    const input = {
      ...formTps?.formValue,
      items: _.map(items, x => ({ ...x, "jumlah": Number(x?.jumlah) })),
      // user_image_path: img
    }
    dispatch(setIsLoadingPopup(true))
    postLaporan({ body: input })
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

  const onChangeItem = (e, index, type?: "number") => {
    setItems(p => _.map(p, (x, k) => {
      let newItem = { ...x }
      let newValue = e.target.value
      if (type === "number") {
        newValue = !isNaN(newValue) || (newValue === "-") ? newValue?.trim?.() : x?.[e.target.name]
      }
      newItem[e.target.name] = newValue
      return k === index ? newItem : x
    }))
  }

  const onUploadLaporan = (e: any, index: number) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0])
    upload(formData)
      .unwrap()
      .then((res) => {
        // const event = { target: { name: "user_image_path", value: res?.data?.image_path } }
        // setImg(res?.data?.image_path)
        onChangeItem({ target: { value: res?.data?.image_path, name: "user_image_path" } }, index)
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
  }

  return (
    <div className='relative'>
      {
        isLoadingUplaod &&
        <div className="absolute w-full h-full rounded flex flex-col gap-2 justify-center items-center  backdrop-blur-sm z-20">
          <Spinner className="w-10 h-10 text-black" />
          <p className="text-black">Upload process...</p>
        </div>
      }
      <GlobalFormReducer
        formName="formTps"
        extraData={{
          area: _.map(area?.data, idx => ({ "label": idx?.name, "value": idx?.name })),
        }}
        fieldGroup={[
          {
            "label": "Area",
            "type": "select",
            "name": "area",
            "placeholder": "Masukan Area",
            "options": ({ extraData }) => extraData?.area,
            "validation": {
              isRequired: true
            }
          }
        ]}
      />
      <div>
        <div className='flex justify-between border-b py-2 mb-1'>
          <div>List Item</div>
          <button className='py-1 px-2 rounded color-secondary text-xs'
            onClick={() => setItems(p => [...p, item])}
          >Tambah Item</button>
        </div>
        <div className='max-h-[15rem] overflow-y-auto px-1' style={{ scrollbarWidth: "thin" }}>
          {
            _.map(items, (x, k) => (
              <div key={k} className="flex gap-2 border-b border-green-100 pb-2">
                {/* <p>{k + 1}</p> */}
                <div className='w-full'>
                  <label className='text-sm text-gray-900 leading-4 bg-red'>Nama Item</label>
                  <div>
                    <Input
                      name="nama_item"
                      value={x?.nama_item}
                      onChange={(e) => onChangeItem(e, k)}
                      invalid={formTps?.isCheckValidate && !x?.nama_item}
                    />
                  </div>
                </div>
                <div className='w-full'>
                  <label className='text-sm text-gray-900 leading-4 bg-red'>Jumlah</label>
                  <div>
                    <Input type="number-custom"
                      name="jumlah"
                      value={x?.jumlah}
                      onChange={(e) => onChangeItem(e, k, "number")}
                      invalid={formTps?.isCheckValidate && !x?.jumlah}
                    />
                  </div>
                </div>
                <div className='w-full'>
                  <label className='text-sm text-gray-900 leading-4 bg-red'>Keterangan</label>
                  <div>
                    <TextArea
                      name="keterangan"
                      value={x?.keterangan}
                      onChange={(e) => onChangeItem(e, k)}
                      invalid={formTps?.isCheckValidate && !x?.keterangan}
                    />
                  </div>
                </div>
                <div className='flex mt-2 items-center gap-4'>
                  <div>
                    {/* <p>Upload Photo</p> */}
                    <UploadProcess
                      rowData={{}}
                      // onChangeFile={(e: any) => onChangeFile(e, x?.id)}
                      onChangeFile={(e: any) => onUploadLaporan(e, k)}
                    />
                  </div>
                  {
                    x?.user_image_path ?
                      <Img src={import.meta.env.VITE_API + x?.user_image_path} className='w-10 h-10 object-contain' />
                      : undefined
                  }
                </div>
                <Button className='hover:text-red-600 cursor-pointer h-fit w-fit mr-1'
                  disabled={items?.length === 1}
                  onClick={() => onRemoveItem(k)}
                >
                  <CloseIcon width={20} height={20} />
                </Button>
              </div>
            ))
          }
        </div>
      </div>
      {/* <div className='flex mt-2 items-center gap-4'>
        <div>
          <p>Upload Photo</p>
          <UploadProcess
            rowData={{}}
            // onChangeFile={(e: any) => onChangeFile(e, x?.id)}
            onChangeFile={(e: any) => onUploadLaporan(e)}
          />
        </div>
        {
          img ?
            <Img src={import.meta.env.VITE_API + img} className='w-20 h-16 object-contain' />
            : undefined
        }
      </div> */}
      <hr className="my-4" />
      <Button className="btn color-primary w-full"
        onClick={() => onSubmit()}
      >Simpan</Button>
    </div>
  )
}

export default FormTPS