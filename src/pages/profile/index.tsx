import Img from "@components/atoms/img"
import Spinner from "@components/atoms/spinner"
import FormAnggota from "@pages/data-anggota/_form"
import { IRootState } from "@store/redux-collection"
import { useGetListUserDetailQuery, usePostUploadPhotoMutation, usePostUserMutation } from "@store/redux-collection/master-data"
import { setToken, useLazyFetchUserSigninQuery } from "@store/redux-collection/sign-in"
import { AnyObj } from "@type"
import _ from "lodash"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export const detaiProfile = [
  {
    index: "user_code",
    alias: "Kode Anggota"
  },
  {
    index: "nik",
    alias: "Nomor Induk Anggota"
  },
  {
    index: "fullname",
    alias: "Nama Lengkap"
  },
  {
    index: "username",
    alias: "Nama Pengguna"
  },
  {
    index: "department",
    alias: "Department"
  },
  {
    index: "jabatan",
    alias: "Jabatan"
  },
]

const Profile = () => {
  const dispatch = useDispatch()
  const [file, setFile] = useState<Blob | MediaSource | any>({})
  const fileInput = useRef<AnyObj | any>(null)

  const { userInfo, token } = useSelector((state: IRootState) => state.signIn.data)
  // const [fetchUser, { data }] = useLazyFetchUserSigninQuery()
  const { data, refetch } = useGetListUserDetailQuery(userInfo?.id, { refetchOnMountOrArgChange: true })
  const [upload, { data: dataUpload, isLoading: isLoadingUplaod }] = usePostUploadPhotoMutation()
  const [updateUser, { isLoading: isLoadingSimpan }] = usePostUserMutation()

  // useEffect(() => {
  //   fetchUser({})
  // }, [])

  useEffect(() => {
    if (file?.type?.includes("image")) {
      const formData = new FormData();
      formData.append('file', file)
      upload(formData)
        .unwrap()
        .then((res) => {
          updateUser({ body: { image_url: res?.data?.image_path }, id: userInfo?.id })
            .unwrap()
            // .then(() => window.location.reload())
            .then(() => {
              dispatch(setToken({
                data: {
                  token: token,
                  userInfo: {
                    ...userInfo,
                    image_url: import.meta.env.VITE_API + res?.data?.image_path
                  }
                }
              }))
            })
        })
      // .finally(()=>window.location.reload())
    }
  }, [file])

  const onChangeFile = (e: any) => {
    setFile(e.target.files[0])
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full p-4">
      <div className="border-t-2 border-t-gray-400 p-4 bg-white w-full h-fit">
        <FormAnggota
          editData={data?.data}
          onSuccess={() => refetch()}
          isProfile={true}
        />
      </div>
      <div className="flex flex-col gap-6 border-t-2 border-t-gray-400 p-4 bg-white w-full h-fit">
        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-2 items-center">
            <div>
              {/* <Img className="w-32 h-32 border rounded-full" src={file?.type?.includes("image") ? URL.createObjectURL(file) : undefined} /> */}
              <Img className="w-32 h-32 border rounded-full" src={userInfo?.image_url ?? dataUpload?.data?.url} />
            </div>
            <div className="flex gap-4 justify-center">
              <div className="flex items-center">
                {(isLoadingUplaod || isLoadingSimpan) && <Spinner />}
                <button className="border px-2 rounded"
                  onClick={() => fileInput?.current?.click()}
                >Ubah Photo</button>
              </div>
              <input
                ref={fileInput}
                // multiple
                onChange={(e) => onChangeFile(e)}
                name="file"
                type="file"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {
            _.map(detaiProfile, (x, k) => (
              <div className="flex gap-2" key={k}>
                <p className="min-w-[10rem]">{x?.alias}</p>
                <p>:</p>
                <p>{data?.data?.[x?.index]}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Profile