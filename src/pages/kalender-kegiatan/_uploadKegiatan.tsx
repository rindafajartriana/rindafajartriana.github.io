import Button from "@components/atoms/button"
import Img from "@components/atoms/img"
import Spinner from "@components/atoms/spinner"
import { getErrorMessage } from "@helpers"
import { usePostKegiatanMutation } from "@store/redux-collection/kegiatan"
import { usePostUploadPhotoMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { AnyObj } from "@type"
import _ from "lodash"
import moment from "moment"
import React, { useRef, useState } from "react"
import { useDispatch } from "react-redux"

const UploadKegiatan = ({ data, onSuccess }) => {
  const dispatch = useDispatch()
  const fileInput = useRef<AnyObj | any>(null)
  // const [file, setFile] = useState<Blob | MediaSource | any>({})
  const [file, setFile] = useState<Blob | MediaSource | any>(data?.image_url ?? "")
  const [upload, { data: dataUpload, isLoading: isLoadingUplaod }] = usePostUploadPhotoMutation()
  const [postKegiatan, { isLoading: isLoadingKegiatan }] = usePostKegiatanMutation()

  const onDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    onUpload(e.dataTransfer.files[0])
  }

  const onChangeFile = (e: any) => {
    onUpload(e.target.files[0])
  }

  const onUpload = (file: Blob | MediaSource | any) => {
    const formData = new FormData();
    formData.append('file', file)
    upload(formData)
      .unwrap()
      .then((res) => {
        setFile(res?.data?.image_path)
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

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postKegiatan({
      body: {
        image_url: file
      },
      id: data?.id
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
    <div className="flex flex-col justify-center items-center">
      <div className="flex w-full gap-3">
        <div className="flex flex-col items-start gap-1">
          {_.map(Object.keys(_.omit(data, ["id", "image_url"])), (x, k) => (
            <div className="flex gap-2" key={k}>
              <p className="min-w-[8rem] capitalize">{x?.replace(/_/g, " ")}</p>
              <p>:</p>
              <p>{x === "tanggal" ? moment(data?.[x]).format("DD-MM-YYYY") : data?.[x]}</p>
            </div>
          ))}
        </div>
        <div className="flex w-1/2 min-h-[10rem] p-4 border rounded-lg hover:shadow  justify-center items-center cursor-pointer"
          onClick={() => fileInput?.current?.click()}
          onDrop={(e) => onDropFile(e)}
          onDragOver={(event) => event.preventDefault()}
        >
          {
            isLoadingUplaod ?
              <div className="flex flex-col items-center gap-2">
                <Spinner />
                <p>Upload...</p>
              </div>
              :
              !file ?
                <p className="text-gray-400 text-center">
                  Pilih Berkas
                  atau drag and drop disini
                </p>
                :
                <div className="w-full flex flex-col items-center">
                  <Img src={file ? import.meta.env.VITE_API + file : data?.image_url ?? ""} srcServer="heroicons-outline/document-text.svg" className="h-[7.5rem]" />
                  <p className="max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-gray-500">{file?.name}</p>
                </div>
          }
        </div>
        <input
          ref={fileInput}
          // multiple
          onChange={(e) => onChangeFile(e)}
          name="file"
          type="file"
          style={{ display: "none" }}
        />
      </div>
      <hr className="my-4 w-full" />
      <div className="flex gap-3">
        <Button className="btn color-primary"
          onClick={() => handleSubmit()}
          isLoading={isLoadingKegiatan}
        >
          Simpan
        </Button>
        <Button className="btn color-secondary"
          onClick={() => dispatch(clearPopup())}
          disabled={isLoadingKegiatan}
        >
          Batal
        </Button>
      </div>
    </div >
  )
}

export default UploadKegiatan