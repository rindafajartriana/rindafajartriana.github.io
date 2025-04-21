import { useDispatch, useSelector } from "react-redux"
import Modals from "../atoms/modals"
import { useEffect, useMemo, useState } from "react"
import _ from "lodash"
import { resetAlert } from "../../store/redux-collection/alert"
import Button from "../atoms/button"
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const GlobalAlert = () => {
  const dispatch = useDispatch()
  const { data: alertData, formValue, isLoading } = useSelector((state: any) => state.alert)
  const [isAutoLoading, setIsAutoLoading] = useState(false)

  useEffect(() => {
    if (isAutoLoading) {
      setIsAutoLoading(false)
    }
  }, [alertData])

  return (
    <Modals
      isOpen={alertData?.length}
      preventClose={isLoading}
      // setIsOpen={() => dispatch(resetAlert())}
      setIsOpen={() => alertData?.slice(-1)?.[0]?.cancelButton?.onClick ? alertData?.slice(-1)?.[0]?.cancelButton?.onClick() : dispatch(resetAlert())}
      classContainer="w-[100px]"
    >
      {
        _.map(alertData?.slice(-1), (idx, key) => (
          <div key={key} className={`modal-card z-[${key}] p-2 bg-red-200`}>
            <h2 className={`capitalize font-bold ${idx?.type === "success" || idx?.type === "berhasil" ?
              "text-green-700"
              : idx?.type === "warning" ? "text-yellow-700"
                : idx?.type === "error" || idx?.type === "peringatan" || idx?.type === "gagal" ? "text-red-700"
                  : "text-gray-700"
              }`}
            >{idx?.type}</h2>
            <h4 className={`max-h-[12rem] w-full overflow-auto whitespace-pre-wrap text-center ${idx?.messageClassName}`}>
              {
                idx?.messageType === 'json' ?
                  (<JSONInput
                    id='a_unique_id'
                    placeholder={typeof idx?.message === 'object' ? idx?.message : {}}
                    locale={locale}
                    width="300px"
                    height='550px'
                  />) : idx?.message
              }
            </h4>
            <div className="flex gap-4">
              {
                idx?.confirmButton &&
                <Button
                  className={`btn color-primary ${idx?.confirmButton?.className}`}
                  onClick={() => {
                    idx?.confirmButton?.onClick(formValue)
                    idx?.confirmButton?.useAutoLoading ? setIsAutoLoading(true) : undefined
                  }}
                  isLoading={isLoading || idx?.confirmButton?.isLoading || isAutoLoading && idx?.confirmButton?.useAutoLoading}
                >{idx?.confirmButton?.text ?? "Ya"}
                </Button>
              }
              {
                idx?.cancelButton &&
                <Button
                  className={`btn color-secondary ${idx?.cancelButton?.className}`}
                  onClick={() => idx?.cancelButton?.onClick ? idx?.cancelButton?.onClick() : dispatch(resetAlert())}
                  disabled={isLoading || idx?.cancelButton?.isLoading}
                >{idx?.cancelButton?.text ?? "Batalkan"}
                </Button>
              }
              {
                (!idx?.confirmButton || !idx?.confirmButton) &&
                <Button
                  className="btn color-secondary"
                  onClick={() => dispatch(resetAlert())}
                >OK
                </Button>
              }
            </div>
          </div>
        ))
      }
    </Modals>
  )
}

export default GlobalAlert