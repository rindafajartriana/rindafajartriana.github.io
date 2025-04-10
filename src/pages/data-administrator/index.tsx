import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { ColumnsType, getGlobalColumns } from "@helpers/globalColumns"
import { aliasColAdmin } from "@pages/data-anggota/_col"
import { useGetListUserQuery } from "@store/redux-collection/master-data"
import { setPopup } from "@store/redux-collection/popup"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormAdmin from "./_form"
import VerifikasiUser from "@pages/data-anggota/_verifikasi"
import { AnyObj } from "@type"
import _ from "lodash"
import { IRootState } from "@store/redux-collection"

const DataAdministrator = () => {
  const dispatch = useDispatch()
  // const { data, isFetching, refetch } = useGetListUserQuery({ role: 1 }, { refetchOnMountOrArgChange: true })
  const { data, isFetching, refetch } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })
  const { userInfo } = useSelector((state: IRootState) => state.signIn.data)

  console.log(userInfo?.access_type)

  const onTambah = (editData?:any) => {
    dispatch(setPopup({
      title: "Tambah Data Administrator",
      containerClass: "md:w-[30rem]",
      content: () => <FormAdmin editData={editData} onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const onVerify = (rowData: AnyObj) => {
    dispatch(setPopup(({
      title: "Verifikasi Pengguna",
      containerClass: "md:w-[30rem]",
      id: "verifyUser",
      content: () => <VerifikasiUser rowData={rowData} onSuccess={() => refetch?.()} />,
      noButton: true
    })))
  }

  const columns: ColumnsType[] = useMemo(() => [
    // {
    //   fieldName: "role",
    //   dataType: "STRING",
    //   // order: 8
    // },
    // {
    //   fieldName: "last_login",
    //   dataType: "DATE"
    // },
  ], [])


  return (
    <div className="main-container h-full border-t-2 border-t-gray-400">
      <div className="mb-3 w-full flex justify-between items-end">
        <h2>List Data</h2>
        <Button className="btn color-primary"
          onClick={() => onTambah()}
        >Tambah Data</Button>
      </div>
      <div className="flex table-height">
        <DataGrid
          idProperty="id"
          data={_.filter(data?.data, x => x?.access_type !== "ANGGOTA")}
          columns={data?.columns?.length ?
            getGlobalColumns([...data?.columns, ...columns], { colsAlias: aliasColAdmin, filterColumnsByAlias: true })
            : []
          }
          contextMenu={[
            {
              label: "Verifikasi Pengguna",
              onClick: ({ rowData }) => onVerify(rowData)
            },
            ...(userInfo?.access_type === 'SU' ? [{
              label: "Edit",
              onClick: ({ rowData }) => onTambah(rowData)
            }] : [])
          ]}
          loading={isFetching}
          // useFilter
          onRefresh={() => refetch()}
        />
      </div>
    </div>
  )
}
export default DataAdministrator