import { WarningIcon } from "@assets/icons/_index"
import Button from "@components/atoms/button"
import GlobalFormReducer from "@components/organisms/globalFormReducer"
import { getErrorMessage } from "@helpers"
import { IRootState } from "@store/redux-collection"
import { setDataForm } from "@store/redux-collection/data-form"
import { useGetListDepartmentQuery, useGetListJabatanQuery, useGetListRoleQuery, useGetListUserQuery, usePostUserRegisterMutation } from "@store/redux-collection/master-data"
import { clearPopup, setIsLoadingPopup, setPopup } from "@store/redux-collection/popup"
import { setRegister } from "@store/redux-collection/sign-in"
import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

const RegisterPage = () => {
  const dispatch = useDispatch()
  const { data } = useGetListUserQuery({ sortBy: "user_code", sortType: "DESC", limit: 1 }, { refetchOnMountOrArgChange: true })

  const { formTambahAnggota } = useSelector((state: IRootState) => state.dataForm.form)
  const { register } = useSelector((state: IRootState) => state.signIn)
  const [postUser, { isLoading }] = usePostUserRegisterMutation()
  const { data: department } = useGetListDepartmentQuery({}, { refetchOnMountOrArgChange: true })
  const { data: jabatan } = useGetListJabatanQuery({}, { refetchOnMountOrArgChange: true })
  const { data: role } = useGetListRoleQuery({}, { refetchOnMountOrArgChange: true })

  const onSubmit = () => {
    if (formTambahAnggota?.isValid) {
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
        formName: "formTambahAnggota",
        isCheckValidate: true
      }))
    }
  }

  const handleSubmit = () => {
    dispatch(setIsLoadingPopup(true))
    postUser({ ...formTambahAnggota?.formValue, "is_verification": 0 })
      .unwrap()
      .then(() => {
        dispatch(clearPopup())
        dispatch(setPopup(({
          title: "Berhasil",
          id: "success",
          type: "success",
          content: "Berhasil melakukan pendaftaran, akun anda akan aktif setelah diverifikasi oleh admin",
          onClose: () => dispatch(setRegister(formTambahAnggota?.formValue?.nik))
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
    <div className="absolute flex w-full h-full p-2 items-center justify-center bg-slate-200 font-roboto">
      <div className="flex flex-col bg-white custom-shadow h-fit p-12 gap-1 rounded w-full md:w-[40rem] border-t-2 border-t-green-700">
        <h2 className="text-lg mb-3">Halaman Pendaftaran</h2>
        {
          register?.length ?
            <div className="flex flex-col gap-2 items-center">
              <div><WarningIcon width={25} height={25} className="text-orange-500" /></div>
              <p>Anda sudah pernah mendaftar. harap menunggu admin melakukan verifikasi agar akun anda aktif dan dapat digunakan untuk login.</p>
              <NavLink to={`${window.location.origin}`} className={"text-blue-700"}>Coba Login Sekarang</NavLink>
            </div>
            :
            <div>
              <GlobalFormReducer
                formName="formTambahAnggota"
                extraData={{
                  department: _.map(department?.data, idx => ({ "label": idx?.department, "value": idx?.id })),
                  jabatan: _.map(jabatan?.data, idx => ({ "label": idx?.jabatan, "value": idx?.id })),
                  role: _.map(_.filter(role?.data, x => (x?.access_type === "ANGGOTA")), idx => ({ "label": idx?.role, "value": idx?.id })),

                }}
                fieldGroup={[
                  // {
                  //   "label": "Kode Anggota",
                  //   "type": "text",
                  //   "name": "user_code",
                  //   "disabled": true,
                  //   "note": "* Otomatis terisi"
                  // },
                  {
                    "label": "Nomor Induk Anggota",
                    "type": "text",
                    "name": "nik",
                    "placeholder": "Masukan NIK",
                    "validation": {
                      isRequired: true
                    }
                  },
                  {
                    "label": "Nama Lengkap",
                    "type": "text",
                    "name": "fullname",
                    "placeholder": "Masukan Nama Lengkap",
                    "validation": {
                      isRequired: true
                    }
                  },
                  {
                    "label": "Nama Pengguna",
                    "type": "text",
                    "name": "username",
                    "placeholder": "Masukan Nama Pengguna",
                    "validation": {
                      isRequired: true
                    }
                  },
                  {
                    "label": "Kata Sandi",
                    "type": "password",
                    "name": "password",
                    "placeholder": "Masukan Kata Sandi",
                    "validation": {
                      isRequired: true
                    }
                  },
                  {
                    "label": "Department",
                    "type": "select",
                    "name": "department_id",
                    "placeholder": "Pilih Department",
                    "options": ({ extraData }) => extraData?.department,
                    "validation": {
                      isRequired: true
                    }
                  },
                  {
                    "label": "Jabatan",
                    "type": "select",
                    "name": "jabatan_id",
                    "placeholder": "Pilih Jabatan",
                    "options": ({ extraData }) => extraData?.jabatan,
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
                    },
                    // disabled: (v, { extraData }) => extraData?.accessType !== "SU"
                  },
                ]}
              />
              <hr className="my-4" />
              <Button className="btn color-primary w-full"
                onClick={() => onSubmit()}
              >Daftar</Button>
            </div>
        }
      </div>
    </div>
  )
}

export default RegisterPage