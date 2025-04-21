import Button from "@components/atoms/button"
import { getErrorMessage } from "@helpers"
import { detaiProfile } from "@pages/profile"
import { usePostUserMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { AnyObj } from "@type"
import _ from "lodash"
import React from "react"
import { useDispatch } from "react-redux"

export const isSudahVerifikasi = ({ is_verification, is_active }) => {
  return (is_verification === "Sudah Verifikasi") && (is_active === "Aktif") ? true : false
}

const VerifikasiUser = ({ rowData, onSuccess }) => {
  const dispatch = useDispatch()
  const [postUser, { isLoading: isLoadingVerify }] = usePostUserMutation()

  const handleVerify = (rowData: AnyObj, verify: { is_verification?: number, is_active?: number }) => {
    const isVerify = (rowData?.is_verification === "Sudah Verifikasi") && (verify?.is_verification === 1) ? { is_active: 1 } : verify
    dispatch(setIsLoadingPopup(true))
    postUser({ body: isVerify, id: rowData?.id })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: "Berhasil melakukan verifikasi pengguna",
          onClose: () => onSuccess?.()
        })))
      })
      .catch((err) => {
        dispatch(clearPopup(-1))
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
      .finally(() => {
        dispatch(setIsLoadingPopup(false))
      })
  }

  return (
    <div>
      <div className="flex flex-col gap-1">
        {_.map([
          ...detaiProfile,
          {
            index: "is_verification",
            alias: "Status Verifikasi"
          },
          {
            index: "is_active",
            alias: "Status Pengguna"
          },
        ], (x, k) => (
          <div className="flex gap-2" key={k}>
            <p className="min-w-[10rem]">{x?.alias}</p>
            <p>:</p>
            <p>{rowData?.[x?.index]}</p>
          </div>
        ))}
      </div>
      <hr className="my-3" />
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => handleVerify(rowData, isSudahVerifikasi(_.pick(rowData, ["is_verification", "is_active"])) ? { is_active: 0 } : { is_verification: 1, is_active: 1 })}
          className={`btn ${isSudahVerifikasi(_.pick(rowData, ["is_verification", "is_active"])) ? "color-danger-outline" : "color-primary"}`}
          isLoading={isLoadingVerify}
        >
          {isSudahVerifikasi(_.pick(rowData, ["is_verification", "is_active"])) ? "Nonaktifkan" : "Aktivasi Pengguna"}
          {/* {rowData?.is_verification === 1 ? "Nonaktifkan" : "Aktivasi Pengguna"} */}
        </Button>
        <Button className="btn color-secondary"
          onClick={() => dispatch(clearPopup())}
          disabled={isLoadingVerify}
        >
          Batal
        </Button>
      </div>
    </div>
  )
}

export default VerifikasiUser