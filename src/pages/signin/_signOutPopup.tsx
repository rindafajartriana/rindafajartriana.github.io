import Button from "@components/atoms/button"
import { clearPopup } from "@store/redux-collection/popup"
import { signOut } from "@store/redux-collection/sign-in"
import { useDispatch } from "react-redux"

const AlertSignOut = () => {
  const dispatch = useDispatch()
  return (
    <div className="w-fit">
      <p>Apa anda yakin ingin keluar dari Applikasi ?</p>
      <p>Anda harus login kembali jika ingin masuk Aplikasi 5R</p>
      <hr className="my-3" />
      <div className="flex justify-end gap-2">
        <Button className="btn color-danger" onClick={() => dispatch(clearPopup())}>Batal</Button>
        <Button className="btn color-primary" onClick={() => {
          dispatch(signOut())
          dispatch(clearPopup())
        }}>Iya, Keluar</Button>
      </div>
    </div>
  )
}

export default AlertSignOut