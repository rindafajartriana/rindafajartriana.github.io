import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { ColumnsType, getGlobalColumns } from "@helpers/globalColumns"
import { useDeleteAreaMutation, useGetListAreaQuery } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { useMemo } from "react"
import { useDispatch } from "react-redux"
import FormArea from "./_form"
import { getErrorMessage } from "@helpers"
import { AnyObj } from "@type"
import _ from "lodash"

const Area = () => {
  const dispatch = useDispatch()
  const { data, isFetching, refetch } = useGetListAreaQuery({}, { refetchOnMountOrArgChange: true })
  const [deleteArea, { isLoading }] = useDeleteAreaMutation()
  const newData = useMemo(() => _.map(data?.data, (x, k) => ({ ...x, "no": k + 1 })), [JSON.stringify(data?.data)])

  const columns: ColumnsType[] = useMemo(() => [
    // {
    //   fieldName: "id",
    //   dataType: "INTEGER"
    // },
    {
      fieldName: "no",
      dataType: "INTEGER"
    },
    {
      fieldName: "name",
      dataType: "STRING"
    },
    // {
    //   fieldName: "status",
    //   dataType: "STRING"
    // }
  ], [])

  const onForm = (editData?:AnyObj) => {
    dispatch(setPopup({
      title: `${editData ? "Ubah" : "Tambah"} Data Area`,
      containerClass: "md:w-[30rem]",
      content: () => <FormArea editData={editData} onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const handleHapus = (id: number) => {
    dispatch(setIsLoadingPopup(true))
    deleteArea(id)
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: "Berhasil Menghapus Data Area",
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

  return (
    <div className="main-container h-full border-t-2 border-t-gray-400">
      <div className="mb-3 w-full flex justify-between items-end">
        <h2>List Data</h2>
        <Button className="btn color-primary"
          onClick={() => onForm()}
        >Tambah Data</Button>
      </div>
      <div className="flex table-height">
        <DataGrid
          idProperty="id"
          data={newData}
          columns={getGlobalColumns(columns, { isAutoHeader: true })}
          loading={isFetching}
          useFilter
          onRefresh={() => refetch()}
          contextMenu={[
            {
              label: "Edit",
              onClick: ({ rowData }) => onForm(rowData)
              // disabled: true,
            },
            {
              label: "Hapus",
              // disabled: true,
              onClick: ({ rowData }) => {
                dispatch(setPopup({
                  "title": "Konfirmasi Hapus Area",
                  "containerClass": "md:w-[25rem]",
                  "id": "removeAnggota",
                  "type": "warning",
                  "content": `Apakah anda yakin ingin menghapus data area '${rowData?.jabatan}'`,
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
  )
}
export default Area