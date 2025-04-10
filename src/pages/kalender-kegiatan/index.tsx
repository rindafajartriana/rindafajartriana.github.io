import Button from "@components/atoms/button";
import DataGrid from "@components/organisms/dataGrid";
import { ColumnsType, getGlobalColumns } from "@helpers/globalColumns";
import {
  useGetListKegiatanQuery,
  usePostKegiatanMutation,
} from "@store/redux-collection/kegiatan";
import {
  clearPopup,
  setIsLoadingPopup,
  setPopup,
} from "@store/redux-collection/popup";
import _ from "lodash";
import moment from "moment";
import { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import FormKegiatan from "./_form";
import { getErrorMessage } from "@helpers";
import UploadKegiatan from "@pages/kalender-kegiatan/_uploadKegiatan";
import { IRootState } from "@store/redux-collection";
import Modals from "@components/atoms/modals";
import Img from "@components/atoms/img";
import { autoRemapFilter } from "@helpers/remappingFilter";

const columns: (OnPreview: (v: any) => void) => ColumnsType[] = (OnPreview) => [
  {
    alias: "No",
    fieldName: "no",
    dataType: "INTEGER",
    defaultWidth: 100,
  },
  {
    alias: "Tanggal",
    fieldName: "tanggal",
    dataType: "DATE",
    defaultWidth: 210,
  },
  {
    alias: "Nama Kegiatan",
    fieldName: "nama_kegiatan",
    dataType: "STRING",
    defaultWidth: 200,
  },
  {
    alias: "Keterangan",
    fieldName: "keterangan",
    dataType: "STRING",
    // defaultWidth: 100
  },
  {
    alias: "Foto",
    fieldName: "image_url",
    dataType: "STRING",
    // defaultWidth: 100
    render: {
      value: (v: any) => (
        <span
          onClick={() => {
            if (OnPreview) {
              OnPreview(v);
            }
          }}
          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
        >
          {v ? "Lihat Foto" : null}
        </span>
      ),
    },
  },
];

const KalenderKegiatan = ({ accessType }) => {
  const dispatch = useDispatch();
  const { data, isFetching, refetch } = useGetListKegiatanQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: dataUser } = useSelector((state: IRootState) => state.signIn);
  const [postKegiatan, { isLoading: isLoadingKegiatan }] =
    usePostKegiatanMutation();
  const [isModal, setIsModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [paramsFilter, setParamsFilter] = useState<any>("");
  const localizer = momentLocalizer(moment);
  const { views, ...otherProps } = useMemo(
    () => ({
      views: {
        month: true,
        week: false,
        day: false,
      },
      // ... other props
    }),
    []
  );

  const onForm = (dateSelected: string, editData?: any) => {
    dispatch(
      setPopup({
        title: `${editData ? "Edit" : "Tambah"} Acara Untuk ${dateSelected}`,
        containerClass: "md:w-[30rem]",
        content: () => (
          <FormKegiatan
            editData={editData}
            dateSelected={dateSelected}
            onSuccess={() => refetch()}
          />
        ),
        noButton: true,
      })
    );
  };

  const onDateClick = ({ slots }) => {
    const dateSelected = moment(slots?.[0]).format("DD-MM-YYYY");
    onForm(dateSelected);
  };

  const handleHapus = (id: number) => {
    dispatch(setIsLoadingPopup(true));
    postKegiatan({ id: id })
      .unwrap()
      .then((res) => {
        dispatch(clearPopup());
        dispatch(
          setPopup({
            title: "Berhasil",
            id: "success",
            type: "success",
            content: res?.meta?.message,
            onClose: () => refetch(),
          })
        );
      })
      .catch((err) => {
        dispatch(
          setPopup({
            title: "Gagal",
            id: "ggal",
            type: "danger",
            content: getErrorMessage(err),
          })
        );
      })
      .finally(() => dispatch(setIsLoadingPopup(false)));
  };

  const onDetail = ({ rowData }) => {
    dispatch(
      setPopup({
        title: `Upload bukti kegiatan`,
        containerClass: "md:w-[30rem]",
        content: () => (
          <UploadKegiatan data={rowData} onSuccess={() => refetch()} />
        ),
        noButton: true,
      })
    );
  };

  const onExport = () => {
    const url = new URL(
      import.meta.env.VITE_API + "/api/v1/master/kegiatan/export"
    );
    url.searchParams.append("filter", paramsFilter);
    fetch(url, {
      method: "GET",
      headers: {
        "x-access-token": `${dataUser?.token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        const link: any = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `kalender_kegiatan_${moment().format("YYMMDDHHmmss")}.xlsx`
        );
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const OnPreview = async (v: any) => {
    setIsLoading(true); // Menandakan bahwa loading sedang berlangsung

    const img = new Image(); // Membuat objek Image baru
    img.onload = () => {
      // Gambar selesai dimuat
      setPreviewUrl(v); // Set URL gambar
      setIsLoading(false); // Menandakan loading selesai
      setIsModal(true); // Tampilkan modal
    };

    img.onerror = (err) => {
      // Jika terjadi error saat memuat gambar
      setIsLoading(false);
      console.error("Error loading image", err);
    };

    img.src = v; // Tentukan sumber gambar (URL)
  };

  return (
    <div className="flex flex-col md:flex-row w-full m-4 gap-4">
      {accessType?.create && (
        <div
          className="main-container h-full border-t-2 border-t-gray-400"
          style={{ margin: 0 }}
        >
          {/* <div className="w-full flex justify-between items-end -mb-[1px]">
          <h2>Pilih Kalender untuk membuat acara baru</h2>
        </div> */}
          <div className="h-[500px] mb-2">
            <Calendar
              views={views}
              localizer={localizer}
              // events={myEventsList}
              onSelectSlot={(x) => onDateClick(x)}
              selectable
              startAccessor="start"
              endAccessor="end"
            />
          </div>
          <h2>Pilih / Klik tanggal untuk membuat acara baru</h2>
        </div>
      )}
      <div
        className="main-container z-10 h-full border-t-2 border-t-gray-400"
        style={{ margin: 0 }}
      >
        <div className="w-full flex justify-between items-end -mb-[1px]">
          <h2>Kegiatan</h2>
          <div className="ml-auto mb-1.5">
            {accessType?.export && (
              <Button
                className="btn color-secondary"
                onClick={() => onExport()}
              >
                Export
              </Button>
            )}
          </div>
        </div>
        <div className="flex min-h-[30rem] pt-2 border-t">
          <DataGrid
            idProperty="id"
            data={data?.data}
            columns={getGlobalColumns(columns(OnPreview))}
            loading={isFetching || isLoading}
            useFilter
            onRefresh={() => refetch()}
            contextMenu={useMemo(
              () =>
                accessType?.create && [
                  {
                    label: "Edit",
                    onClick: ({ rowData }) => {
                      onForm(
                        moment(rowData?.tanggal).format("DD-MM-YYYY"),
                        rowData
                      );
                    },
                  },
                  {
                    label: "Upload Hasil Kegiatan",
                    onClick: (row) => onDetail(row),
                  },
                  {
                    label: "Hapus",
                    onClick: ({ rowData }) => {
                      dispatch(
                        setPopup({
                          title: "Konfirmasi Hapus Kegiatan",
                          containerClass: "md:w-[25rem]",
                          id: "removeKegiatan",
                          type: "warning",
                          content: `Apakah anda yakin ingin menghapus data kegiatan '${rowData?.nama_kegiatan}'`,
                          confirm: {
                            name: "Ya, Hapus!",
                            onClick: () => handleHapus(rowData?.id),
                          },
                          cancel: {
                            name: "Tidak, Batalkan!",
                            onClick: (i) => {
                              dispatch(clearPopup(i));
                              dispatch(
                                setPopup({
                                  title: "Dibatalkan",
                                  id: "btalHapus",
                                  type: "danger",
                                  content:
                                    "Proses hapus data berhasil dibatalkan, data aman!",
                                })
                              );
                            },
                          },
                        })
                      );
                    },
                  },
                ],
              [accessType?.create]
            )}
            onFilterValue={(e:any) => {
              let result = autoRemapFilter(e).join(",");
              if (result) {
                setParamsFilter(result);
              } else {
                setParamsFilter("");
              }
            }}
          />
        </div>
      </div>
      <Modals
        isOpen={isModal}
        setIsOpen={() => setIsModal(false)}
        classContainer="flex max-w-[70%] items-center justify-center"
        preventClose={true}
      >
        {!isLoading && (
          <Img
            src={previewUrl}
            alt="Preview 1"
            className="max-w-full max-h-[97vh] object-contain"
          />
        )}
      </Modals>
    </div>
  );
};
export default KalenderKegiatan;
