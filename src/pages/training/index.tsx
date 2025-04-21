import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { ColumnsType, getGlobalColumns } from "@helpers/globalColumns"
import { useDeleteJabatanMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormJabatan from "./_form"
import { getErrorMessage } from "@helpers"
import { useGetListHistoryTrainingQuery, useGetListSoalQuery, usePostSoalMutation, usePostStartTrainingMutation } from "@store/redux-collection/history-laporan"
import FormSoal from "./_form"
import { AnyObj } from "@type"
import KuisionerPage from "@pages/training/_kuisioner"
import { IRootState } from "@store/redux-collection"
import ExportLaporan from "@pages/training/_export_laporan"
import _ from "lodash"



const columns: ColumnsType[] = [
  {
    fieldName: "id",
    alias: "ID",
    dataType: "INTEGER"
  },
  {
    fieldName: "soal",
    alias: "Soal",
    dataType: "STRING"
  },
  {
    fieldName: "jawaban",
    alias: "Jawaban",
    dataType: "STRING"
  }
]

const listMenu = [
  {
    index: 1,
    label: "Training"
  },
  {
    index: 2,
    label: "Lihat History Training"
  },
  {
    index: 3,
    label: "Buat Soal"
  }
]


const Training = ({ accessType }) => {
  const dispatch = useDispatch()
  const { data, isFetching, refetch } = useGetListSoalQuery({}, { refetchOnMountOrArgChange: true })
  const { data: dataHistory, isFetching: isFetchingHistory, refetch: refetchHistory } = useGetListHistoryTrainingQuery({}, { refetchOnMountOrArgChange: true })
  const [deleteSoal, { isLoading }] = usePostSoalMutation()
  const [postStart, { }] = usePostStartTrainingMutation()
  const { data: dataUser } = useSelector((state: IRootState) => state.signIn)
  const [tab, setTab] = useState(1)

  const columnsHistory: any[] = useMemo(() => {
    let basicCol = [
      {
        fieldName: "username",
        alias: "Nama Pengguna",
        dataType: "STRING"
      },
      {
        fieldName: "start_time",
        alias: "Mulai",
        dataType: "DATE"
      },
      {
        fieldName: "end_time",
        alias: "Selesai",
        dataType: "DATE"
      },
    ]
    if (accessType?.create) {
      let advCol = [
        {
          fieldName: "department_name",
          alias: "Department",
          dataType: "STRING"
        },
        {
          fieldName: "jabatan_name",
          alias: "Jabatan",
          dataType: "STRING"
        },
        {
          fieldName: "status_hasil",
          alias: "Status",
          dataType: "STRING"
        },
      ]
      return [...basicCol, ...advCol]
    } else {
      return basicCol
    }
  }, [accessType?.create])

  const onForm = (type: "tambah" | "edit", rowData?: AnyObj) => {
    dispatch(setPopup({
      title: `${type?.toUpperCase?.()} SOAL`,
      containerClass: "md:w-[25rem]",
      content: () => <FormSoal editData={rowData} onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const onMulaiSoal = () => {
    dispatch(setPopup({
      title: "Peringatan",
      type: "warning",
      containerClass: "md:w-[30rem]",
      content: () => <div>Apakah anda yakin ingin mulai mengerjakan soal?</div>,
      confirm: {
        name: "Ya, Kerjakan!",
        onClick: () => onKuisioner()
      }
    }))
  }

  const onKuisioner = () => {
    dispatch(setIsLoadingPopup(true))
    postStart({})
      .unwrap()
      .then((res) => {
        dispatch(clearPopup())
        dispatch(setPopup({
          title: `Training`,
          preventClose: true,
          containerClass: "md:w-[40rem] md:max-h-[90%] overflow-y-auto",
          content: () => <KuisionerPage training_token={res?.data?.training_token} />,
          noButton: true
        }))
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
      .finally(() => dispatch(setIsLoadingPopup(false)))
  }

  const handleHapus = (id: number) => {
    dispatch(setIsLoadingPopup(true))
    deleteSoal({ id })
      .unwrap()
      .then((res) => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          onClose: () => refetch()
        })))
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
      .finally(() => dispatch(setIsLoadingPopup(false)))
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

  const filterListMenu: any[] = useMemo(() => _.filter(listMenu, x => (x.index !== 3) || accessType?.create), [accessType?.create])

  // return true ? (
  //   <div className="w-full flex p-4 gap-5">
  //     {
  //       _.map(listMenu, (x, k) => (
  //         <div className="bg-white rounded p-5 h-fit cursor-pointer hover:border hover:border-green-700" key={k}>
  //           {x?.label}
  //         </div>
  //       ))
  //     }
  //   </div>
  // )

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4">
      <div className="flex items-end border-b-2 border-green-700">
        {
          _.map(filterListMenu, (x, k) => (
            // <div className="py-1 px-4 h-fit cursor-pointer border-b-2 hover:border-green-700"
            // key={k}
            //   onClick={() => setTab(x?.index)}
            // >
            //   {x?.label}
            // </div>
            <h2
              key={k}
              className={`py-2 px-4 text-gray-400 hover:text-white hover:cursor-pointer  rounded-t  ${tab === x?.index ? " bg-green-700 text-white border-green-700" : "hover:bg-green-600 "}`}
              onClick={() => {
                setTab(x?.index)
              }}
            >
              {x?.label}
            </h2>
          ))
        }
      </div>
      {
        accessType?.answer && (tab === 1) &&
        <div className="flex h-full justify-center items-center">
          <Button className="py-4 px-7 rounded-full color-primary w-fit"
            onClick={() => onMulaiSoal()}
          >Mulai Kerjakan Soal</Button>
        </div>
      }
      {
        accessType?.history && (tab === 2) &&
        <div className="border-t-2 border-t-gray-400 p-4 bg-white">
          <div className="mb-3 w-full flex justify-between items-end">
            <h2>List History Training</h2>
            {
              accessType?.export &&
              <Button className="btn color-secondary"
                onClick={() => onExport()}
              >Export</Button>
            }
          </div>
          <div className="flex table-height">
            <DataGrid
              idProperty="id"
              data={dataHistory?.data}
              columns={getGlobalColumns(columnsHistory, { isAutoHeader: true })}
              loading={isFetching}
              useFilter
              onRefresh={() => refetchHistory()}
            />
          </div>
        </div>
      }
      {
        accessType?.create && (tab === 3) &&
        <div className="border-t-2 border-t-gray-400 p-4 bg-white">
          <div className="mb-3 w-full flex justify-between items-end">
            <h2>List Soal</h2>
            <div className="flex gap-3">
              <Button className="btn color-primary"
                onClick={() => onForm("tambah")}
              >Tambah Soal</Button>
            </div>
          </div>
          <div className="flex table-height">
            <DataGrid
              idProperty="id"
              data={data?.data}
              columns={getGlobalColumns(columns, { isAutoHeader: true })}
              loading={isFetching}
              useFilter
              onRefresh={() => refetch()}
              contextMenu={[
                {
                  label: "Edit",
                  onClick: ({ rowData }) => onForm("edit", rowData)
                },
                {
                  label: "Hapus",
                  onClick: ({ rowData }) => {
                    dispatch(setPopup({
                      "title": "Konfirmasi Hapus Soal",
                      "containerClass": "md:w-[25rem]",
                      "id": "removeAnggota",
                      "type": "warning",
                      "content": `Apakah anda yakin ingin menghapus data soal '${rowData?.soal}'`,
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
            />
          </div>
        </div>
      }
    </div>
  )
}
export default Training