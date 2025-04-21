import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { ColumnsAliasType, ColumnsType, getGlobalColumns } from "@helpers/globalColumns"
import { useDeleteJabatanMutation, useGetListJabatanQuery, usePostUploadPhotoMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup, setPreviewImage } from "@store/redux-collection/popup"
import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormJabatan from "./_form"
import { getErrorMessage } from "@helpers"
import DataGridServer from "@components/organisms/dataGridServer"
import { useFetchListHistoryLaporanMutation, usePostLaporanMutation } from "@store/redux-collection/history-laporan"
import FormTPS from "./_form"
import { AnyObj } from "@type"
import _ from "lodash"
import TextArea from "@components/atoms/textarea"
import { IRootState } from "@store/redux-collection"
import ExportLaporan from "@pages/history-laporan/_export_laporan"
import { UploadProcess } from "@pages/training/_kuisioner"
import Img from "@components/atoms/img"
import { setReloadGrid } from "@store/redux-collection/data-grid"
import Spinner from "@components/atoms/spinner"
import DetailStatus from "@pages/history-laporan/_detailStatus"
import Select2 from "@components/atoms/select2"

const colAlias: ColumnsAliasType[] = [
  {
    index: "no",
    alias: "No",
    defaultWidth: 100
  },
  {
    index: "area",
    alias: "Area"
  },
  {
    index: "approved_status",
    alias: "Status Permintaan"
  },
  {
    index: "current_approver",
    alias: "Status Sekarang"
  }
]

const detailLaporan = [
  {
    index: "area",
    alias: "Area"
  },
  {
    index: "created_at",
    alias: "Tanggal Laporan"
  },
  {
    index: "username",
    alias: "Pelapor"
  },
  {
    index: "status",
    alias: "Status"
  },
]

const FormApproval = ({ rowData, onSuccess }) => {
  const dispatch = useDispatch()
  const [img, setImg] = useState("")
  const [upload, { data: dataUpload, isLoading: isLoadingUplaod }] = usePostUploadPhotoMutation()
  const [postLaporan, { isLoading }] = usePostLaporanMutation()
  const [keterangan, setKeterangan] = useState("")
  const [itemAcc, setItemAcc] = useState<{ id: number, status: 1 | 0 }[]>([])
  const onVerify = (type: "approve" | "complete" | "reject") => {
    dispatch(setPopup({
      title: "Konfirmasi",
      type: "warning",
      content: () => (
        <div>
          <p>Apakah anda yakin?</p>
        </div>
      ),
      confirm: {
        name: `Ya, ${type?.toUpperCase?.()}!`,
        onClick: () => handleVerify(type)
      },
      cancel: {
        name: "Batal"
      }
    }))
  }

  const handleVerify = (type: "approve" | "complete" | "reject") => {
    dispatch(setIsLoadingPopup(true))
    postLaporan({
      body: {
        "action": type,
        "keterangan": keterangan,
        "approver_image_path": img ? img : undefined,
        "items": itemAcc?.length ? itemAcc : undefined
      },
      id: rowData?.id
    })
      .unwrap()
      .then((res) => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          onClose: () => {
            onSuccess?.()
          }
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

  const onUploadLaporan = (e: any) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0])
    upload(formData)
      .unwrap()
      .then((res) => {
        // const event = { target: { name: "user_image_path", value: res?.data?.image_path } }
        setImg(res?.data?.image_path)
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

  const disalbedAction = useMemo(() =>
    !rowData?.can_approve
    , [keterangan, rowData])

  const listImg = useMemo(() =>
    _.map(rowData?.detail, x => ({ path: x?.user_image_path, label: x?.nama_item }))
    , [JSON.stringify(rowData?.detail ?? [])])

  const isLastApproval = useMemo(() => rowData?.is_last_approval && rowData?.status !== "SELESAI", [rowData])

  const onAccItem = (id: number, status: 1 | 0) => {
    setItemAcc(p => [..._.reject(p, { id: id }), { id, status }])
  }

  return (
    <div className="relative flex flex-col gap-2">
      {
        isLoadingUplaod &&
        <div className="absolute w-full h-full rounded flex flex-col gap-2 justify-center items-center  backdrop-blur-sm z-20">
          <Spinner className="w-10 h-10 text-black" />
          <p className="text-black">Upload process...</p>
        </div>
      }
      <div className="flex flex-col gap-2">
        {
          _.map(detailLaporan, (x, k) => (
            <div className="flex gap-2" key={k}>
              <p className="min-w-[10rem]">{x?.alias}</p>
              <p>:</p>
              <p>{rowData?.[x?.index]}</p>
            </div>
          ))
        }
      </div>
      <div className="flex flex-col gap-2">
        <p>Detail Items</p>
        <table className="w-full text-left border custom-table-simple text-xs">
          <thead className="border-b">
            <th>Nama Item</th>
            <th>Jumlah</th>
            <th>Keterangan</th>
            <th>Photo</th>
            {
              isLastApproval ?
                <>
                  <th>Sesuai</th>
                  <th>Tidak Sesuai</th>
                </> : undefined
            }
          </thead>
          <tbody>
            {
              _.map(rowData?.detail, (x, k) => (
                <tr key={k}>
                  <td>{x?.nama_item}</td>
                  <td>{x?.jumlah}</td>
                  <td>{x?.keterangan}</td>
                  <td>
                    {
                      x?.user_image_path ?
                        <p
                          className="text-blue-700 cursor-pointer"
                          onClick={() => dispatch(setPreviewImage({ list: listImg, default: x?.user_image_path }))}
                        >
                          Lihat
                        </p> : "-"
                    }
                  </td>
                  {
                    isLastApproval ?
                      <>
                        <td>
                          <input className="cursor-pointer" type="checkbox"
                            checked={_.find(itemAcc, { id: x?.id })?.status === 1}
                            onChange={() => onAccItem(x?.id, 1)}
                          />
                        </td>
                        <td>
                          <input className="cursor-pointer" type="checkbox"
                            checked={_.find(itemAcc, { id: x?.id })?.status === 0}
                            onChange={() => onAccItem(x?.id, 0)}
                          />
                        </td>
                      </> : undefined
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        {/* {
          rowData?.image_url ?
            <div className="w-1/2">
              <p>Photo Sebelum</p>
              <Img src={rowData?.image_url} className='w-20 h-16 object-contain' />

            </div>
            : undefined
        } */}
        {
          rowData?.image_url_after ?
            <div className="w-1/2">
              <p>Photo Sesudah</p>
              <Img src={rowData?.image_url_after} className='w-20 h-16 object-contain' />

            </div>
            : undefined
        }
      </div>
      {
        (rowData?.status !== "SELESAI") &&
        <div>
          <label>Tambahkan Keterangan</label>
          <TextArea onChange={(e) => setKeterangan(e.target.value)} ></TextArea>
        </div>
      }
      {
        isLastApproval ?
          <div className='flex mt-2 items-center gap-4'>
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
          </div> : undefined
      }
      <hr className="my-2" />
      {
        rowData?.status !== "SELESAI" ?
          <div className="flex gap-3 justify-center">
            <Button
              className="btn color-primary"
              onClick={() => onVerify(rowData?.is_last_approval ? "complete" : "approve")}
              disabled={disalbedAction || (rowData?.is_last_approval && rowData?.detail?.length !== itemAcc?.length) || (rowData?.is_last_approval && !img)}
            >
              {rowData?.is_last_approval ? "Selesai" : "Approve"}
            </Button>
            <Button
              className="btn color-danger"
              onClick={() => {
                if(!keterangan){
                  dispatch(setPopup({
                    title: "Konfirmasi",
                    type: "warning",
                    content: () => (
                      <div>
                        <p>Silahkan masukan keterangan terlebih dulu untuk melanjutkan proses "Reject"</p>
                      </div>
                    )
                  }))
                }else{
                  onVerify("reject")
                }
              }}
              disabled={disalbedAction}
            >
              Reject
            </Button>
          </div> :
          <p className="text-sm text-green-800">*Laporan ini telah selesai</p>
      }
    </div>
  )
}

const HistoryLaporan = ({ accessType }) => {
  const dispatch = useDispatch()
  const { data, isFetching, refetch } = useGetListJabatanQuery({}, { refetchOnMountOrArgChange: true })
  const [deleteJabatan, { isLoading }] = useDeleteJabatanMutation()
  const [params, setParams] = useState("all")

  const columns: ColumnsType[] = useMemo(() => [
    {
      fieldName: "id",
      dataType: "INTEGER"
    },
    {
      fieldName: "jabatan",
      dataType: "STRING"
    }
  ], [])

  const onTambah = () => {
    dispatch(setPopup({
      title: "Tambah Data TPS / Laporan",
      containerClass: "md:w-[30rem]",
      content: () => <FormTPS onSuccess={() => onReload()} />,
      noButton: true
    }))
  }

  // const handleHapus = (id: number) => {
  //   dispatch(setIsLoadingPopup(true))
  //   deleteJabatan(id)
  //     .unwrap()
  //     .then(() => {
  //       dispatch(clearPopup())
  //       dispatch(setPopup(({
  //         title: "Berhasil",
  //         id: "success",
  //         type: "success",
  //         content: "Berhasil Menghapus Data Jabatan",
  //         onClose: () => refetch()
  //       })))
  //     })
  //     .catch((err) => {
  //       dispatch(setPopup(({
  //         title: "Gagal",
  //         id: "ggal",
  //         type: "danger",
  //         content: getErrorMessage(err)
  //       })))
  //     })
  //     .finally(() => dispatch(setIsLoadingPopup(false)))
  // }

  const onApproval = (rowData: AnyObj) => {
    dispatch(setPopup({
      title: "Konfirmasi Laporan",
      id: "formApp",
      containerClass: "md:w-[30rem]",
      preventOutsideClose: true,
      content: () => <FormApproval rowData={rowData} onSuccess={() => onReload()} />,
      noButton: true
    }))
  }

  const onExport = () => {
    dispatch(setPopup({
      title: "Export Laporan TPS",
      id: "formApp",
      containerClass: "md:w-[30rem]",
      content: () => <ExportLaporan />,
      noButton: true
    }))
  }

  const onReload = () => {
    dispatch(setReloadGrid("historylaporan"))
  }

  const onDetail = (rowData: AnyObj) => {
    dispatch(setPopup({
      title: "Detail Status",
      id: "formApp",
      containerClass: "md:w-[30rem]",
      content: () => <DetailStatus rowData={rowData} />,
      noButton: true
    }))
  }

  return (
    <div className="main-container h-full border-t-2 border-t-gray-400">
      <div className="mb-3 w-full flex justify-between items-end">
      <div className="flex-row items-center justify-between">
          <h2>List Data</h2>
          <div className="flex items-center">
            <h2 className="mr-2 text-gray-400">Filter</h2>
            <Select2 onClear={()=>{
              setParams('all')
            }} onSelect={(e)=>{setParams(e?.value)}} value={params} options={[{ value: 'all', label: 'Semua' },{ value: 'sudah', label: 'Sudah Approve' },{ value: 'belum', label: 'Belum Approve' }]} />
          </div>
        </div>
        <div className="flex gap-3">
          {
            accessType?.create &&
            <Button className="btn color-primary"
              onClick={() => onTambah()}
            >Tambah Data</Button>
          }
          <div>
            {
              accessType?.export &&
              <Button className="btn color-secondary"
                onClick={() => onExport()}
              >Export</Button>
            }
          </div>
        </div>
      </div>
      <div className="flex table-height">
        <DataGridServer
          reducerGrid="historylaporan"
          idProperty="id"
          useMutation={useFetchListHistoryLaporanMutation}
          autoColumns
          columnsAlias={colAlias}
          filterColumnsByAlias
          params={{approved_status: params}}
          defaultLimit={50}
          contextMenu={useMemo(() => {
            let access = [
              {
                label: "Lihat Status Detail",
                onClick: ({ rowData }) => onDetail(rowData)
              },
            ]
            if (accessType?.confirm) {
              access.push({
                label: "Konfirmasi",
                onClick: ({ rowData }) => onApproval(rowData)
              })
            }
            return access
          }, [accessType?.confirm])}
        />
        {/* <DataGrid
          idProperty="id"
          data={data?.data}
          columns={getGlobalColumns(columns, { isAutoHeader: true })}
          loading={isFetching}
          useFilter
          onRefresh={() => refetch()}
          contextMenu={[
            {
              label: "Edit",
              onClick: () => console.log("edit")
            },
            {
              label: "Hapus",
              onClick: ({ rowData }) => {
                dispatch(setPopup({
                  "title": "Konfirmasi Hapus Jabatan",
                  "containerClass": "md:w-[25rem]",
                  "id": "removeAnggota",
                  "type": "warning",
                  "content": `Apakah anda yakin ingin menghapus data jabatan '${rowData?.jabatan}'`,
                  "confirm": {
                    "name": "Ya, Hapus!",
                    onClick: () => handleHapus(rowData?.id)
                  },
                  "cancel": {
                    "name": "Tidak, Batalkan!",
                    "onClick": (i) => {
                      dispatch(clearPopup(i))
                      dispatch(setPopup({
                        title: "Dibatalkan",
                        id: "btalHapus",
                        type: "danger",
                        content: "Proses hapus data berhasil dibatalkan, data aman!"
                      }))
                    }
                  }
                }))
              }
            }
          ]}
        /> */}
      </div>
    </div>
  )
}
export default HistoryLaporan