import Button from "@components/atoms/button"
import DataGrid from "@components/organisms/dataGrid"
import { getGlobalColumns } from "@helpers/globalColumns"
import { useDeleteUserMutation, useFetchQrMutation, useGetListUserQuery, usePostUserMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { useDispatch, useSelector } from "react-redux"
import FormAnggota from "./_form"
import { aliasColAnggota } from "./_col"
import { getErrorMessage } from "@helpers"
import { AnyObj } from "@type"
import _ from "lodash"
import { detaiProfile } from "@pages/profile"
import GenerateQr from "@pages/data-anggota/_qr"
import { useEffect, useState } from "react"
import VerifikasiUser from "@pages/data-anggota/_verifikasi"
import { IRootState } from "@store/redux-collection"

const DataAnggota = () => {
  const dispatch = useDispatch()
  const [isRegUser, setIsRegUser] = useState(false)
  const { data: dataUser } = useSelector((state: IRootState) => state.signIn)
  const { data, isFetching, refetch } = useGetListUserQuery({}, { refetchOnMountOrArgChange: true })
  const [deleteUser, { isLoading }] = useDeleteUserMutation()
  // const [postUser, { isLoading: isLoadingVerify }] = usePostUserMutation()
  const [fetchQr, { data: dataQr, isLoading: isLoadingQr }] = useFetchQrMutation()
    const { userInfo } = useSelector((state: IRootState) => state.signIn.data)

  useEffect(() => {
    if (dataQr?.data) {
      onGeneratQr(dataQr?.data)
    }
  }, [dataQr])


  const onForm = (editData?: AnyObj) => {
    dispatch(setPopup({
      title: "Tambah Data Anggota",
      containerClass: "md:w-[30rem]",
      content: () => <FormAnggota editData={editData} onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const onGeneratQr = (data: any) => {
    dispatch(setPopup({
      title: "QR Untuk Registrasi Anggota",
      containerClass: "md:w-[30rem]",
      content: () => <GenerateQr data={data} />,
      noButton: true
    }))
  }

  const handleHapus = (id: number) => {
    dispatch(setIsLoadingPopup(true))
    deleteUser({ id: id })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: "Berhasil Menghapus Data Anggota",
          onClose: () => refetch()
        })))
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          id: "ggal",
          type: "danger",
          content: getErrorMessage(err)
        })))
      })
      .finally(() => dispatch(setIsLoadingPopup(false)))
  }

  const onVerify = (rowData: AnyObj) => {
    dispatch(setPopup(({
      title: "Verifikasi Pengguna",
      containerClass: "md:w-[30rem]",
      id: "verifyUser",
      content: () => <VerifikasiUser rowData={rowData} onSuccess={() => refetch?.()} />,
      noButton: true
    })))
    // if (rowData?.is_verification) {
    //   dispatch(setPopup(({
    //     title: "Verifikasi Pengguna",
    //     type: "warning",
    //     id: "statusUser",
    //     content: "Pengguna sudah terverifikasi!"
    //   })))
    // } else {
    //   dispatch(setPopup(({
    //     title: "Verifikasi Pengguna",
    //     containerClass: "md:w-[30rem]",
    //     id: "verifyUser",
    //     content: () =>
    //       <div className="flex flex-col gap-1">
    //         {_.map(detaiProfile, (x, k) => (
    //           <div className="flex gap-2" key={k}>
    //             <p className="min-w-[10rem]">{x?.alias}</p>
    //             <p>:</p>
    //             <p>{rowData?.[x?.index]}</p>
    //           </div>
    //         ))}
    //       </div>,
    //     confirm: {
    //       name: `Konfirmasi Pengguna`,
    //       onClick: () => handleVerify(rowData)
    //     },
    //     cancel: {
    //       name: "Batal"
    //     }
    //   })))
    // }
  }

  // const handleVerify = (rowData: AnyObj) => {
  //   dispatch(setIsLoadingPopup(true))
  //   postUser({ body: { is_verification: 1 }, id: rowData?.id })
  //     .unwrap()
  //     .then(() => {
  //       dispatch(clearPopup())
  //       dispatch(setPopup(({
  //         title: "Berhasil",
  //         id: "success",
  //         type: "success",
  //         content: "Berhasil melakukan verifikasi pengguna",
  //         onClose: () => refetch()
  //       })))
  //     })
  //     .catch((err) => {
  //       dispatch(clearPopup(-1))
  //       dispatch(setPopup(({
  //         title: "Gagal",
  //         id: "ggal",
  //         type: "danger",
  //         content: getErrorMessage(err)
  //       })))
  //     })
  //     .finally(() => {
  //       dispatch(setIsLoadingPopup(false))
  //     })
  // }

  const onExport = () => {
    fetch(import.meta.env.VITE_API + "/api/v1/user/export", {
      method: 'GET',
      headers: {
        'x-access-token': `${dataUser?.token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(blob);
        window.open(url)
        const link:any = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `user.xlsx`,
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
    <div className="main-container relative h-full border-t-2 border-t-gray-400">
      <div className="mb-3 w-full flex flex-wrap gap-2 justify-between items-end">
        <div>
          <h2>List Data</h2>
          <div className="gap-1 flex items-center text-sm text-gray-400">
            <input type={"checkbox"} checked={isRegUser} onChange={(e) => setIsRegUser(e.target.checked)} className="cursor-pointer" />
            <label className="whitespace-nowrap">Tampilkan hanya anggota yang belum diverifikasi</label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button className="btn color-secondary"
            isLoading={isLoadingQr}
            onClick={() => fetchQr({})}
          >Generate QR</Button>
          <Button className="btn color-primary"
            onClick={() => onForm()}
          >Tambah Data</Button>
          <Button className="btn color-secondary"
            onClick={() => onExport()}
          >Export</Button>
        </div>
      </div>
      <div className="flex table-height">
        <DataGrid
          idProperty="id"
          data={_.filter(data?.data, x => (isRegUser ? x?.is_verification === "Belum Verifikasi" : x) && x?.access_type === "ANGGOTA")}
          columns={getGlobalColumns(
            data?.columns,
            {
              colsAlias: aliasColAnggota,
              filterColumnsByAlias: true
            }
          )}
          loading={isFetching}
          useFilter
          contextMenu={[
            {
              label: "Verifikasi Pengguna",
              onClick: ({ rowData }) => onVerify(rowData)
            },
              ...(userInfo?.access_type === 'SU' ? [{
                label: "Edit",
                onClick: ({ rowData }) => onForm(rowData)
              }] : []),
              ...(userInfo?.access_type === 'SU' ? [{
              label: "Hapus",
              onClick: ({ rowData }) => {
                dispatch(setPopup({
                  "title": "Konfirmasi Hapus Anggota",
                  "containerClass": "md:w-[25rem]",
                  "id": "removeAnggota",
                  "type": "warning",
                  "content": `Apakah anda yakin ingin menghapus data anggota '${rowData?.fullname}'`,
                  "confirm": {
                    "name": "Ya, Hapus!",
                    onClick: () => handleHapus(rowData?.id)
                  },
                  "cancel": {
                    "name": "Tidak, Batalkan!",
                    "onClick": (i) => {
                      dispatch(clearPopup(i))
                      dispatch(setPopup({
                        title: "Dibatalkan",
                        id: "btalHapus",
                        type: "danger",
                        content: "Proses hapus data berhasil dibatalkan, data aman!"
                      }))
                    }
                  }
                }))
              }
            }] : []),
          ]}
          onRefresh={() => refetch()}
        />
      </div>
    </div>
  )
}
export default DataAnggota