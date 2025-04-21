import _ from "lodash"
import moment from "moment"
import React from "react"

// const DotRadio

const DetailStatus = ({ rowData }) => {
  return (
    <div>
      {
        _.map(rowData?.history_approval, (x, k) => (
          <div key={k} className="flex gap-2">
            <p >{moment(x?.created_at).format("DD-MM-YYYY HH:mm")}</p>
            <div className="relative mb-5">
              {(k + 1 !== rowData?.history_approval?.length) && <div className="absolute border-l h-8 top-[18px] left-[7px] w-1" />}
              <input
                type="radio"
                className="bg-white"
                checked={parseInt(k)===0}
                // checked={k + 1 === rowData?.history_approval?.length}
                // disabled={k + 1 !== rowData?.history_approval?.length}
              />
            </div>
            <p>{x?.approver}</p>
          </div>
        ))
      }
    </div>
  )
}

export default DetailStatus