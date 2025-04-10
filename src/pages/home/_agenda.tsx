import Spinner from "@components/atoms/spinner"
import { useGetListKegiatanQuery } from "@store/redux-collection/kegiatan"
import _ from "lodash"
import moment from "moment"
import React, { useMemo } from "react"

const Agenda = () => {
  const { data, isFetching, refetch } = useGetListKegiatanQuery({}, { refetchOnMountOrArgChange: true })
  const listKegiatan = useMemo(() =>
    _.orderBy(_.filter(data?.data, x => {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss")
      return moment(x?.tanggal).isSameOrAfter(dateNow)
    }), ["tanggal"])
    , [JSON.stringify(data?.data ?? [])])

  return (
    <div className="px-4">
      <p className="border-b border-green-700 text-[1.06rem] text-gray-700 mb-2">List Kegiatan Yang akan datang</p>
      <div className="flex flex-wrap w-full">
        {isFetching ?
          <div className="flex gap-2 text-sm text-gray-600 items-center">
            <Spinner className="w-5 h-5" />
            <p>Memeriksa...</p>
          </div>
          :
          listKegiatan?.length ?
            _.map(listKegiatan, (x, k) => (
              <div className="p-1 w-1/4">
                <div className="bg-white p-2 rounded">
                  <p>{moment(x?.tanggal).format("DD-MM-YYYY")}</p>
                  <hr />
                  <p className="text-gray-700 text-sm">{x?.nama_kegiatan}</p>
                  <p className="text-gray-500 text-xs">{x?.keterangan}</p>
                </div>
              </div>
            ))
            : <p className="text-xs text-gray-600">Tidak ada kegiatan</p>

        }
      </div>
    </div>
  )
}

export default Agenda