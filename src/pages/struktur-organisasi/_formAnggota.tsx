import Button from "@components/atoms/button"
import GlobalFormReducer from "@components/organisms/globalFormReducer"
import { getErrorMessage } from "@helpers"
import { IRootState } from "@store/redux-collection"
import { setDataForm } from "@store/redux-collection/data-form"
import { usePostStrukturAnggotaMutation, usePostStrukturMutation } from "@store/redux-collection/dokumen"
import { useFetchListUserMutation, useGetListRoleQuery } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { AnyObj } from "@type"
import _ from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import FormStrukturOrganisasi from "./_form"

const FormAnggota = ({ data, onSuccess }) => {
  const dispatch = useDispatch()
  const { formTambahRoleAnggota } = useSelector((state: IRootState) => state.dataForm.form)
  const [postRoleAnggota, { isLoading }] = usePostStrukturAnggotaMutation()
  const { data: role } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    dispatch(setDataForm({
      formName: "formTambahRoleAnggota",
      formValue: {
        ...formTambahRoleAnggota?.formValue,
        "id_struktur": data?.id,
        "name_struktur": data?.name
      }
    }))
  }, [data])


  const onSubmit = () => {
    if (formTambahRoleAnggota?.isValid) {
      dispatch(setPopup({
        title: "Konfirmasi",
        type: "warning",
        content: "Apakah data yang anda input sudah benar ?",
        confirm: {
          name: "Ya, Simpan",
          onClick: () => handleSubmit()
        },
        cancel: {
          name: "Batal"
        }
      }))
    } else {
      dispatch(setDataForm({
        formName: "formTambahRoleAnggota",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    const body = _.omit(formTambahRoleAnggota?.formValue, ["name_struktur"])
    dispatch(setIsLoadingPopup(true))
    postRoleAnggota({ body })
      .unwrap()
      .then((res) => {
        dispatch(clearPopup(-1))
        dispatch(clearPopup(-1))
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          onClose: () => onSuccess?.(body?.role_id, _.find(role?.data, { id: body?.role_id })?.role)
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
      <GlobalFormReducer
        formName="formTambahRoleAnggota"
        extraData={{
          role: _.map(role?.data, idx => ({ "label": idx?.role, "value": idx?.id })),
        }}
        fieldGroup={[
          {
            "label": "Struktur",
            "type": "text",
            "name": "name_struktur",
            "disabled": true,
            "validation": {
              isRequired: true
            }
          },
          {
            "label": "Posisi",
            "type": "select",
            "name": "role_id",
            "placeholder": "Pilih Posisi",
            "options": ({ extraData }) => extraData?.role,
            "validation": {
              isRequired: true
            }
          },
        ]}
      />
      <hr className="my-4" />
      <Button className="btn color-primary w-full"
        onClick={() => onSubmit()}
      >Simpan</Button>
    </div>
  )
}

const ListOrg = ({ data: masterData, onReload }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState(masterData)

  const [postStruktur] = usePostStrukturMutation()
  const [postStrukturAnggota] = usePostStrukturAnggotaMutation()
  const [fetchUser] = useFetchListUserMutation()

  const onSuccess = (role_id: number, dept: string) => {
    fetchUser({ role: role_id })
      .unwrap()
      .then((res) => {
        const newData = _.map(res?.data, x => ({
          dept: dept,
          fullname: x?.fullname,
          role_id: role_id
        }))
        setData(p => ({ ...p, "anggota": [...p?.anggota, ...newData] }))
      })
  }

  const onTambahAnggota = () => {
    dispatch(setPopup({
      title: "Tambah Anggota",
      containerClass: "md:w-[30rem]",
      id: "tambahAnggota",
      content: () => <FormAnggota data={data} onSuccess={(role_id: number, dept: string) => onSuccess(role_id, dept)} />,
      noButton: true
    }))
  }

  const onEdit = () => {
    dispatch(setPopup({
      title: "Ubah Organisasi",
      containerClass: "md:w-[30rem]",
      id: "formUbah",
      content: () => <FormStrukturOrganisasi editData={data} onSuccess={() => onReload("reload")} />,
      noButton: true
    }))
  }

  const onHapus = (type: "struktur" | "role", item: AnyObj) => {
    dispatch(setPopup({
      "title": `Konfirmasi Hapus ${type?.charAt?.(0).toUpperCase?.() + type?.slice?.(1)}`,
      "containerClass": "md:w-[25rem]",
      "id": "removeAnggota",
      "type": "warning",
      "content": `Apakah anda yakin ingin menghapus ${type} '${type === "struktur" ? item?.name : item?.dept + " dari struktur " + data?.name}'`,
      "confirm": {
        "name": "Ya, Hapus!",
        "onClick": () => handleHapus(type, item)
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

  const handleHapus = (type: "struktur" | "role", item: AnyObj) => {
    const postDelete = type === "struktur" ? postStruktur : postStrukturAnggota
    let input: AnyObj = { id: data?.id }
    if (type === "role") input.role_id = item?.role_id
    dispatch(setIsLoadingPopup(true))
    postDelete(input)
      .unwrap()
      .then((res) => {
        // dispatch(clearPopup(-1))
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          onClose: () => {
            if (type === "role") setData(p => ({ ...p, "anggota": _.reject(p?.anggota, { role_id: item?.role_id }) }))
            else onReload?.(data?.id)

            dispatch(clearPopup(-1))
          }
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

  return (
    <div className="flex flex-col gap-2 border p-2">
      <div className="flex justify-between gap-2">
        <p className="w-full">{data?.name} </p>
        {
          (data?.parent_id !== 0) &&
          <Button className="px-3 py-[1px] color-secondary text-xs whitespace-nowrap rounded-lg"
            onClick={() => onEdit()}
          >
            Edit
          </Button>
        }
        {
          (data?.parent_id !== 0) &&
          <Button className="px-3 py-[1px] color-danger text-xs whitespace-nowrap rounded-lg"
            onClick={() => onHapus("struktur", data)}
          >
            Hapus Struktur
          </Button>
        }
      </div>
      <hr />
      <div className="text-sm flex flex-col gap-2">
        {
          _.map(_.uniqBy(data?.anggota, "role_id"), (x: any, k) => (
            <div>
              <div key={k} className="flex justify-between">
                {/* <p>Role{x?.role}</p> */}
                <p>Anggota</p>
                <Button className="px-3 py-[1px]  color-danger-outline text-xs whitespace-nowrap rounded-lg"
                  onClick={() => onHapus("role", x)}
                >
                  Hapus Posisi Anggota
                </Button>
              </div>
              {
                _.map(_.filter(data?.anggota, { "role_id": x?.role_id }), (xx: any, kk) => (
                  <div key={kk} className="px-2 flex gap-2">
                    <p>{kk + 1}.</p>
                    <p>{xx?.fullname}</p>
                    <p>{xx?.dept}</p>
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
      {
        !_.uniqBy(data?.anggota, "role_id")?.length ?
          <Button className="px-3 py-[2px]  color-secondary w-fit text-xs whitespace-nowrap rounded-lg"
            onClick={() => onTambahAnggota()}
          >Tambah Posisi Anggota</Button> : undefined
      }
    </div>
  )
}

const FormStrukturAnggota = ({ data: tempData, onReload }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState<AnyObj>(tempData)
  const [postStruktur] = usePostStrukturMutation()

  const onHapusStruktur = (id: number) => {
    setData(p => ({ ...p, childNode: _.reject(p?.childNode, { id: id }) }))
  }

  const onHapus = (type: "struktur" | "role", item: AnyObj) => {
    dispatch(setPopup({
      "title": `Konfirmasi Hapus ${type?.charAt?.(0).toUpperCase?.() + type?.slice?.(1)}`,
      "containerClass": "md:w-[25rem]",
      "id": "removeAnggota",
      "type": "warning",
      "content": `Apakah anda yakin ingin menghapus garis tambahan ${item?.name} dari ${type}`,
      "confirm": {
        "name": "Ya, Hapus!",
        "onClick": () => handleHapus(type, item)
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

  const handleHapus = (type: "struktur" | "role", item: AnyObj) => {
    let input: AnyObj = { id: item?.id }
    dispatch(setIsLoadingPopup(true))
    postStruktur(input)
      .unwrap()
      .then((res) => {
        dispatch(clearPopup(-1))
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: res?.meta?.message,
          onClose: () => {
            onReload?.(item?.id)
            dispatch(clearPopup(-1))
          }
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

  const listDataCN = useMemo(() => {
    const filterNodeChild = _.filter(data?.childNode, x => x?.childNode?.length)
    const mapValue = _.flatMap(filterNodeChild, x => x?.childNode)
    return filterNodeChild?.length ? [...data?.childNode, ...mapValue] : data?.childNode
  }, [data])
  
  return (
    <div className="flex flex-col gap-2">
      <ListOrg
        data={data}
        onReload={() => {
          onReload()
          dispatch(clearPopup())
        }}
      />
      {
        _.map(listDataCN, (dataNode, key) => (
          <ListOrg
            data={dataNode} key={key}
            onReload={(id: number | "reload") => {
              if (id === "reload") {
                onReload()
              }
              else onHapusStruktur(id)
            }}
          />
        ))
      }
      {
        _.map(_.filter(data?.child, x => x?.name?.includes?.("#extend")), (x, k) => (
          <div className="border p-2 flex justify-between" key={k}>
            <p>{x?.name}</p>
            <Button className="px-3 py-[1px] color-danger text-xs whitespace-nowrap rounded-lg"
              onClick={() => onHapus("struktur", x)}
            >
              Hapus
            </Button>
          </div>
        ))
      }
    </div>
  )
}

export default FormStrukturAnggota