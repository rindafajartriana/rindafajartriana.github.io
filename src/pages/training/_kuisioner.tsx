import { ArrowRight, CloseIcon } from "@assets/icons/_index"
import Button from "@components/atoms/button"
import Img from "@components/atoms/img"
import Spinner from "@components/atoms/spinner"
import TextArea from "@components/atoms/textarea"
import { getErrorMessage } from "@helpers"
import { SectionList } from "@pages/training/_dist"
import { useGetListSoalTrainingQuery, usePostStartTrainingMutation, usePostSubmitTrainingMutation } from "@store/redux-collection/history-laporan"
import { usePostUploadPhotoMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { AnyObj } from "@type"
import _ from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"

// const dummy = [{
//   "id": 3,
//   "soal": "2.Berikan contoh kegiatan Ringkas di ruang kerja Anda! Terdapat poto dan keterangan  ( upload ) 1 saja",
//   "idx": 1,
//   "section_id": 1,
//   "has_photo": 1,
//   "status": 1,
//   "session_id": 2
// }]

export const UploadProcess = ({
  onChangeFile,
  rowData
}) => {

  // const [file, setFile] = useState<Blob | MediaSource | any>({})
  const fileInput = useRef<AnyObj | any>(null)
  return (
    <>
      <button className="border p-2 rounded"
        onClick={() => fileInput?.current?.click()}
      >Upload</button>
      <input
        ref={fileInput}
        // multiple
        onChange={(e) => onChangeFile(e, rowData?.id)}
        name="file"
        type="file"
        style={{ display: 'none' }}
      />
    </>
  )
}

const KuisionerPage = ({ training_token }) => {
  const dispatch = useDispatch()
  const [items, setItems] = useState<AnyObj[]>([])
  const [section, setSection] = useState(1)
  const [postSimpan, { data, isLoading }] = usePostSubmitTrainingMutation()
  const [upload, { data: dataUpload, isLoading: isLoadingUplaod }] = usePostUploadPhotoMutation()
  const { data: dataTraining, isLoading: isLoadingTraining } = useGetListSoalTrainingQuery({
    training_token: training_token
  }, {
    skip: !training_token,
    refetchOnMountOrArgChange: true
  })

  const sectionTraining = useMemo(() =>
    _.groupBy(dataTraining?.data, "section_id")
    , [JSON.stringify(dataTraining?.data ?? [])])

  useEffect(() => {
    if (dataTraining?.data) {
      setItems(_.map(dataTraining?.data, x => ({ id: x?.id })))
    }
  }, [dataTraining?.data])

  const onChangeItem = (e: any, index: number) => {
    setItems(p =>
      _.map(p, (x, k) => {
        let newItem = { ...x }
        newItem[e.target.name] = e.target.value
        return index === x?.id ? newItem : x
      })
    )
  }

  const onSubmit = () => {
    dispatch(setPopup({
      title: "Perhatian",
      content: "Apakah kamu yakin sudah mengisi soal dengan benar? jawaban yang sudah tersimpan tidak dapat diubah!",
      containerClass: " md:w-[25rem]",
      type: "warning",
      id: "selesai warning",
      confirm: {
        name: "Ya, Selesaikan",
        onClick: () => handleSubmit()
      },
      cancel: {
        name: "Tidak, Periksa Kembali"
      }
    }))
  }

  const handleSubmit = () => {
    const input = {
      // ..._.pick(dataTraining?.data?.[0], ["session_id", "section_id"]),
      ..._.pick(dataTraining?.data?.[0], ["session_id"]),
      soal: items
    }
    dispatch(setIsLoadingPopup(true))
    postSimpan(input)
      .unwrap()
      .then((res) => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          // onClose: () => onSuccess?.()
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

  const onChangeFile = (e: any, index: number) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0])
    upload(formData)
      .unwrap()
      .then((res) => {
        const event = { target: { name: "images_path", value: res?.data?.image_path } }
        onChangeItem(event, index)
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
    // const event = { target: { name: "images_path", value: "http://31.59.129.144:6001/files/1741699216416.png" } }
    // onChangeItem(event, index)
  }

  return (
    <div className="relative h-full flex flex-col gap-3">
      <div className="font-semibold flex">
        {
          _.map(Object.keys(sectionTraining ?? {}), (x, k) => (
            <div className={`flex items-center ${Number(x) === section ? "text-green-800" : ""}`}>
              {k > 0 && <ArrowRight className="w-4 h-4 mx-2" />}
              <p key={k}
                className="cursor-pointer"
                onClick={() => setSection(Number(x))}
              >{_.find(SectionList, { section_id: Number(x) })?.section_name}</p>
            </div>
          ))
        }
      </div>
      {
        isLoadingUplaod &&
        <div className="absolute w-full h-full rounded flex flex-col gap-2 justify-center items-center  backdrop-blur-sm">
          <Spinner className="w-10 h-10 text-black" />
          <p className="text-black">Upload process...</p>
        </div>
      }
      {isLoadingTraining ?
        <div className="w-full flex flex-col justify-center items-center h-16 gap-3 m-2">
          <Spinner className="w-8 h-8" />
          <p>Memuat data...</p>
        </div>
        :
        // _.map(dataTraining?.data, (x, k) => (
        _.map(sectionTraining?.[section], (x, k) => (
          <div key={k}>
            <div className="flex gap-1">
              {/* <div>{x?.idx}.</div> */}
              <div>{k + 1}. {x?.soal}</div>
            </div>
            <div className="flex gap-2">
              <TextArea
                value={_.find(items, { id: x?.id })?.jawaban ?? ""}
                name="jawaban"
                onChange={(e) => onChangeItem(e, x?.id)}
              />
              {
                x?.has_photo ?
                  <UploadProcess
                    rowData={x}
                    onChangeFile={(e: any) => onChangeFile(e, x?.id)}
                  />
                  : undefined
              }
            </div>
            {
              _.find(items, { id: x?.id })?.images_path &&
              <div className="relative my-2 bg-gray-800 w-fit rounded overflow-hidden">
                <div className="cursor-pointer absolute right-0 m-1"
                  onClick={() => onChangeItem({ target: { name: "images_path", value: "" } }, x?.id)}
                >
                  <CloseIcon
                    className="w-4 h-4 text-red-700 bg-red-200 bg-opacity-50 rounded"
                  />
                </div>
                <Img className="w-16 h-10" src={import.meta.env.VITE_API + _.find(items, { id: x?.id })?.images_path} />
              </div>
            }
          </div>
        ))
      }
      <hr className="my-2" />
      <div className="flex gap-4 justify-center">
        <Button className="btn color-primary"
          onClick={() => {
            // onSubmit()
            if (sectionTraining?.[section + 1]?.length) {
              setSection(p => p + 1)
            } else {
              onSubmit()
            }
          }}
        >
          {sectionTraining?.[section + 1]?.length ? "Selanjutnya" : "Selesai"}
        </Button>
        <Button className="btn color-secondary" onClick={() => {
          if (section === 1) {
            dispatch(setPopup({
              title: "Perhatian",
              content: "Apakah kamu yakin ingin memabatalkan? soal yang sudah dijawab tidak akan tersimpan!",
              containerClass: " md:w-[25rem]",
              type: "warning",
              id: "warning",
              confirm: {
                name: "Ya, Batalkan",
                onClick: () => dispatch(clearPopup())
              },
              cancel: {
                name: "Tidak, Lanjut Mengerjakan"
              }
            }))
          } else {
            setSection(p => p - 1)
          }
        }
        }>
          {section === 1 ? "Batalkan" : "Sebelumnya"}
        </Button>
      </div>
    </div >
  )
}

export default KuisionerPage