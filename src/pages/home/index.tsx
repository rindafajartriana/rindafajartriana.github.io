import Spinner from "@components/atoms/spinner"
import { IRootState } from "@store/redux-collection"
import { useGetListUserQuery } from "@store/redux-collection/master-data"
import { useGetListPesanQuery } from "@store/redux-collection/pesan"
import _ from "lodash"
import { useCallback } from "react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import Chart from "@pages/home/_chart"
import Agenda from "@pages/home/_agenda"
import { useGetListKegiatanQuery } from "@store/redux-collection/kegiatan"

//DONT CHANGE THIS PAGE
const DashboardPage = ({ accessType }) => {
  const { data: dataAdmin, isFetching: isLoadingAdmin } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })
  const { data: dataAnggota, isFetching: isLoadingAnggota } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })
  const { data: dataPesan, isFetching: isLoadingPesan } = useGetListPesanQuery({ type: "inbox" }, { refetchOnMountOrArgChange: true })
  const { data: dataKegiatan, isFetching: isLoadingKegiatan } = useGetListKegiatanQuery({}, { refetchOnMountOrArgChange: true })
  const { userInfo } = useSelector((state: IRootState) => state.signIn.data)

  const isLoading = useCallback((label: string) => {
    switch (label) {
      case "Anggota":
        return isLoadingAnggota
      case "Administrator":
        return isLoadingAdmin
      case "Pesan":
        return isLoadingPesan
      case "Kegiatan":
        return isLoadingPesan
      default:
        false
        break;
    }
  }, [isLoadingAdmin, isLoadingAnggota, isLoadingPesan])
  return (
    <div className="py-3 w-full">
      <h2 className="text-[1rem] text-gray-600 -mt-[1px] mb-3 mx-4">Selamat Datang, {userInfo?.fullname}</h2>
      {
        accessType?.counter &&
        <div className="flex w-full text-gray-500 flex-wrap px-2">
          {
            _.map([
              {
                label: "Anggota",
                total: (data) => _.filter(data?.data, x => x?.access_type === "ANGGOTA")?.length ?? 0,
                url: () => "/admin/master-data/data-anggota",
                bg: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              },
              {
                label: "Administrator",
                total: (data) => _.filter(data?.data, x => x?.access_type !== "ANGGOTA")?.length ?? 0,
                url: () => "/admin/master-data/administrator",
                bg: "bg-gradient-to-r from-red-500 to-pink-700 text-white"
              },
              {
                label: "Pesan",
                total: (data) => data?.data?.length ?? 0,
                url: () => "/admin/pesan",
                bg: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
              },
              {
                label: "Kegiatan",
                total: (data) => data?.data?.length ?? 0,
                url: () => "/admin/agenda-kegiatan-5r/kalender-kegiatan",
                bg: "bg-gradient-to-r from-green-500 to-green-700 text-white"
              }
            ], (idx, key) => (
              <div key={key} className="w-full md:w-1/2 lg:w-1/3 h-[8rem] items-center flex flex-col px-[8px] pb-4">
                <div className={`${idx?.bg} flex flex-col items-center rounded-sm shadow shadow-gray-700 w-full h-full`}>
                  <div className="h-full flex flex-col items-center p-3 gap-1 justify-center">
                    {
                      isLoading(idx?.label) ?
                        <div className="h-9 flex items-center justify-center">
                          <Spinner className="mr-0 h-7 w-7" />
                        </div>
                        :
                        <div className="text-4xl h-9">
                          {idx?.total?.(idx?.label === "Anggota" ? dataAnggota : idx?.label === "Administrator" ? dataAdmin : idx?.label === 'Kegiatan' ? dataKegiatan : dataPesan)}
                        </div>
                    }
                    <div className="">{idx?.label}</div>
                  </div>
                  <NavLink to={idx?.url()} className="text-sm cursor-pointer bg-opacity-50 hover:bg-opacity-40 w-full text-center bg-gray-500 text-gray-200 hover:text-white">
                    More Info
                  </NavLink>
                </div>
              </div>
            ))
          }
        </div>
      }
      {
        accessType?.chart &&
        <Chart />
      }
      {
        accessType?.agenda &&
        <Agenda />
      }
    </div >
  )
}
export default DashboardPage