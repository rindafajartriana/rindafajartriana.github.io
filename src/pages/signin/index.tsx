import { LockIcon, UserIcon } from "@assets/icons/_index"
import Button from "@components/atoms/button"
import Img from "@components/atoms/img"
import Input from "@components/atoms/input"
import { baseUrl, getErrorMessage } from "@helpers"
import { clearPopup, setPopup } from "@store/redux-collection/popup"
import { setToken, useLazyFetchUserSigninQuery, usePostSignInMutation } from "@store/redux-collection/sign-in"
import { useState } from "react"
import { useDispatch } from "react-redux"

const SigninPage = () => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({ username: "", password: "" })
  const [postLogin, { isLoading }] = usePostSignInMutation()
  const [fetchUsers, { isFetching: isLoadingUsers }] = useLazyFetchUserSigninQuery()

  const handleSubmit = () => {
    postLogin(form)
      .unwrap()
      .then(async (res) => {
        const users = await fetchUsers(res?.data?.access_token).unwrap()
        if (users?.meta?.success) {
          dispatch(setToken({
            data: {
              token: res?.data?.access_token,
              userInfo: users?.data
            }
          }))
        } else {
          throw ("Terjadi kesalahan saat akses users")
        }
      })
      .catch((err) => {
        dispatch(setPopup(({
          title: "Gagal",
          type: "danger",
          content: getErrorMessage(err),
          onEnter: (i) => dispatch(clearPopup(i))
        })))
      })
  }

  return (
    <div className="absolute flex w-full h-full p-2 items-center justify-center bg-slate-200 font-roboto">
      <div className="flex flex-col bg-white custom-shadow w-fit h-fit p-12 gap-1 rounded min-w-full md:min-w-[22rem] border-t-2 border-t-green-700">
        <div className="w-full flex justify-center">
          <div className="mb-10">
            <Img src={baseUrl("/img/5r.png")} className="w-32 h-32" />
          </div>
        </div>
        {/* <p className="text-sm">Selamat datang silahkan masuk untuk mengakses sistem</p> */}
        <div className="flex flex-col gap-5">
          <div className="flex relative items-center">
            <Input
              placeholder="Nama Pengguna"
              name="username"
              value={form?.username}
              onChange={(e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
            />
            <UserIcon width={15} className="absolute right-2" />
          </div>
          <div className="flex relative items-center">
            <Input
              placeholder="Kata Sandi"
              type="password"
              name="password"
              value={form?.password}
              onChange={(e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
              onKeyDown={(e) => e?.keyCode === 13 && handleSubmit()}
              // preventShowPassword
              icons={<LockIcon width={15} className="absolute right-2" />}
            />
            {/* <LockIcon width={15} className="absolute right-2" /> */}
          </div>
          <Button className="btn color-primary"
            onClick={() => handleSubmit()}
            isLoading={isLoading || isLoadingUsers}
          >
            Masuk
          </Button>
        </div>
        <div className="mt-6 flex justify-center text-gray-500 text-sm">
          <p>Hak Cipta © 2025 . Team 5R</p>
        </div>
      </div>
    </div>
  )
}

export default SigninPage