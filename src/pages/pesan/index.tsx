import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { ColumnsType, getGlobalColumns } from "@helpers/globalColumns"
import { useGetListPesanQuery } from "@store/redux-collection/pesan/pesan.query"
import { setPopup } from "@store/redux-collection/popup"
import _ from "lodash"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import FormPesan from "./_form"
import { AnyObj } from "@type"
import DetailPesan from "@pages/history-laporan/_detail"

type type = "inbox" | "sentbox"


// const columns: (type: type) => ColumnsType[] = (type) => [
const columns: ColumnsType[] = [
  {
    fieldName: "username_from",
    alias: "Dari",
    dataType: "STRING"
  },
  {
    fieldName: "username_to",
    alias: "Tujuan",
    dataType: "STRING"
  },
  {
    fieldName: "judul",
    alias: "Judul",
    dataType: "STRING"
  },
  {
    fieldName: "isi",
    alias: "Isi Pesan",
    dataType: "STRING"
  },
  {
    fieldName: "status",
    alias: "Status",
    dataType: "STRING"
  },
  // {
  //   fieldName: "tanggal_kirim",
  //   alias: "Tanggal",
  //   dataType: "DATE"
  // },
]

const PesanPage = () => {
  const dispatch = useDispatch()
  const [type, setType] = useState<type>("inbox")
  const { data, isFetching, refetch } = useGetListPesanQuery({ type }, { refetchOnMountOrArgChange: true })

  const columnsFilter = useMemo(() => {
    const reject = type === "inbox" ? "username_to" : "username_from"
    return _.reject(columns, x => x?.fieldName === reject)
  }, [type])

  const onForm = () => {
    dispatch(setPopup({
      title: "Kirim Pesan",
      containerClass: "md:w-[30rem]",
      content: () => <FormPesan onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const onLihat = (detail: AnyObj) => {
    dispatch(setPopup({
      title: "Detail Pesan",
      containerClass: "md:w-[30rem]",
      id: "detailPesan",
      content: () => <DetailPesan data={detail} type={type} />,
      noButton: true
    }))
  }

  return (
    <div className="main-container h-full border-t-2 border-t-gray-400">
      <div className="w-full flex justify-between items-end -mb-[1px]">
        <div className="flex items-end">
          {
            _.map([
              {
                index: "inbox",
                label: "Pesan Masuk",
              },
              {
                index: "sentbox",
                label: "Pesan Terkirim",
              },
            ], (idx: { index: type, label: string }, key) => (
              <h2
                key={key}
                className={`p-2 text-gray-400 hover:text-black hover:cursor-pointer  ${type === idx?.index ? "border-t border-x bg-white border-t-green-700 text-black" : ""}`}
                onClick={() => {
                  setType(idx?.index)
                }}
              >
                {idx?.label}
              </h2>
            ))
          }
        </div>
        <Button className="btn color-primary mb-1" onClick={() => onForm()}>Kirim Pesan</Button>
      </div>
      <div className="flex table-height pt-2 border-t">
        <DataGrid
          idProperty="id"
          data={data?.data}
          columns={getGlobalColumns(columnsFilter)}
          loading={isFetching}
          useFilter
          onRefresh={() => refetch()}
          contextMenu={[
            {
              label: "Lihat",
              onClick: ({ rowData }) => onLihat(rowData)
            }
          ]}
        />
      </div>
    </div>
  )
}
export default PesanPage