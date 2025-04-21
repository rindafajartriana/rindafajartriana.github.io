import Button from "@components/atoms/button"
import InputDate from "@components/atoms/inputDate"
import { IRootState } from "@store/redux-collection"
import React, { useState } from "react"
import { useSelector } from "react-redux"

const ExportLaporan = () => {
  const [tanggal_awal, setTanggalAwal] = useState("")
  const [tanggal_akhir, setTanggalAkhir] = useState("")
  const { data: dataUser } = useSelector((state: IRootState) => state.signIn)

  const handleExport = () => {
    const filterDate = tanggal_awal && tanggal_akhir ? `?tanggal_awal=${tanggal_awal}&tanggal_akhir=${tanggal_akhir}` : ""
    fetch(import.meta.env.VITE_API + "/api/v1/training/export" + filterDate, {
      method: "GET",
      headers: {
        "x-access-token": `${dataUser?.token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(blob);
        window.open(url)
        const link: any = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `tps_laporan_${tanggal_awal}_${tanggal_akhir}.xlsx`,
        );
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      })
  }

  return (
    <div>
      <div className="flex gap-3 items-center">
        <label className=" whitespace-nowrap">Mulai</label>
        <InputDate type="date" name="tanggal_awal" onChange={(e) => setTanggalAwal(e.target.value)} />
        <label className=" whitespace-nowrap">s/d</label>
        <InputDate type="date" name="tanggal_akhir" onChange={(e) => setTanggalAkhir(e.target.value)} />
      </div>
      <hr className="my-3" />
      <div>
        <Button className="btn color-primary w-full"
          disabled={!tanggal_awal || !tanggal_akhir}
          onClick={() => handleExport()}
        >Export</Button>
      </div>
    </div>
  )
}

export default ExportLaporan