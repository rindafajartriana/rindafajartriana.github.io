import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import _ from "lodash"
import { PopupTypes, clearPopup } from "../../store/redux-collection/popup"
import Modals from "@components/atoms/modals"
import Button from "@components/atoms/button"
import { ErrorIcon, SuccessIcon, WarningIcon } from "@assets/icons/_index"

const getIcon = (type: any) => {
  switch (type) {
    case "warning":
      return <WarningIcon width={22} height={22} style={{ color: "#ea580c" }} />
    case "danger":
      return <ErrorIcon width={22} height={22} style={{ color: "#dc2626" }} />
    case "success":
      return <SuccessIcon width={22} height={22} style={{ color: "#16a34a" }} />
    default:
      return undefined
  }
}

const Popup = () => {
  const dispatch = useDispatch()
  const { data, isLoading }: PopupTypes = useSelector((state: any) => state.popup)

  const handleClose = (index: number, onClose: any, preventClose?: boolean) => {
    // console.log("key", index)
    if (!isLoading && !preventClose) {
      dispatch(clearPopup(index))
      if (onClose) onClose()
    }
  }

  const onKeyDown = (e: any) => {
    // console.log("e.key", e.key, data?.slice(-1)[0])
    if (e.key === "Escape" || e.key === "Enter") {
      // const lastData = data?.[-1]
      const lastData = data?.slice(-1)[0]

      if (e.key === "Escape") handleClose(-1, lastData?.onClose, lastData?.preventClose)
      if ((e.key === "Enter") && lastData.onEnter) lastData.onEnter(-1)
    }
  }

  useEffect(() => {
    if (data?.length) {
      window.location.hash = `#popup${data?.length - 1}`
      document.addEventListener("keydown", onKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    }
  }, [data])

  return _.map(data, (idx, key) => (
    <Modals
      key={key}
      isOpen={true}
      setIsOpen={() => handleClose(key, idx?.onClose, idx?.preventClose)}
      preventClose={isLoading || idx?.preventClose ? idx?.preventClose : (key + 1) < data?.length ? true : false}
      classContainer={idx?.containerClass ?? "w-[19rem] md:w-[19rem] max-h-[95%] overflow-y-auto"}
      preventOutsideClose={idx?.preventOutsideClose}
    >
      <div tabIndex={key} id={`popup${key}`} className={`flex static flex-col justify-between min-w-[10rem] min-h-[2rem] p-4 space-y-3 h-full font-roboto text-gray-500`}>
        <div className="flex flex-col space-y-3 h-full">
          {
            idx?.title &&
            <div>
              <div className="flex items-center space-x-1 tracking-wide">
                {getIcon(idx?.type)}
                <h2 className="font-bold text-[1.2rem] mb-[1px] text-gray-700">{idx?.title}</h2>
              </div>
              <hr />
            </div>
          }
          {idx?.content ?
            typeof idx?.content === 'string' ?
              <p className="min-h-[3rem]">{idx?.content}</p>
              : idx?.content(key, isLoading)
            : idx?.content}
        </div>
        {
          !idx?.noButton ?
            <div className="flex justify-center gap-3">
              {
                idx?.confirm ?
                  <Button
                    className="btn color-primary"
                    onClick={() => idx?.confirm?.onClick && idx?.confirm?.onClick(key)}
                    isLoading={isLoading}
                  >
                    {idx?.confirm?.name ?? "Konfirmasi"}
                  </Button> : undefined
              }
              <Button
                className="btn color-secondary"
                onClick={() => idx?.cancel?.onClick ? idx?.cancel?.onClick(key) : handleClose(key, idx?.onClose, idx?.preventClose)}
                disabled={isLoading}
              >
                {idx?.cancel?.name ? idx?.cancel?.name : idx?.confirm ? "Batal" : "OK"}
              </Button>
            </div> : undefined
        }
      </div>
    </Modals>
  ))
}

export default Popup