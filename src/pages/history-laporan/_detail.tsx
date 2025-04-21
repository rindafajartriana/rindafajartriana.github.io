import _ from 'lodash'
import React, { useMemo } from 'react'

export const detail = [
  {
    index: "username_from",
    alias: "Dari"
  },
  {
    index: "username_to",
    alias: "Tujuan"
  },
  {
    index: "judul",
    alias: "Judul"
  },
  // {
  //   index: "tanggal",
  //   alias: "tanggal_kirim"
  // },
  // {
  //   index: "isi",
  //   alias: "Isi Pesan"
  // },
]

const DetailPesan = ({
  data,
  type
}) => {

  const detailFilter = useMemo(() => {
    const reject = type === "inbox" ? "username_to" : "username_from"
    return _.reject(detail, { index: reject })
  }, [type, detail])

  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        {
          _.map(detailFilter, (x, k) => (
            <div className="flex gap-2" key={k}>
              <p className="min-w-[10rem] text-gray-400">{x?.alias}</p>
              <p>:</p>
              <p>{data?.[x?.index]}</p>
            </div>
          ))
        }
      </div>
      <hr />
      <div className='my-3'>
        {data?.isi}
      </div>
    </div>
  )
}

export default DetailPesan