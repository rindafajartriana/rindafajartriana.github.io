import { ArrowRight } from "@assets/icons/_index"
import Sidebar from "@components/organisms/sidebar"
import Topbar from "@components/organisms/topbar"
import { IRootState } from "@store/redux-collection"
import { setIsOpenSidebar } from "@store/redux-collection/dummy"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

const Layout = ({ children, name, accessType }: any) => {
  const dispatch = useDispatch()
  const { isOpenSidebar: isOpen } = useSelector((state: IRootState) => state.dummy)

  return (
    <div className="custom-body">
      <div className="flex flex-col w-full">
        <Topbar />
        <div className="flex h-full font-poppins">
          <Sidebar accessType={accessType} />
          <div className="flex flex-col w-full bg-slate-200 font-roboto">
            {
              isOpen &&
              <div onClick={() => dispatch(setIsOpenSidebar(!isOpen))} className="fixed visible md:invisible bg-black/50 backdrop-blur-sm z-10 w-full h-full" />
            }
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div className="mt-3 items-end gap-3 w-fit mx-4">
                <h1 className="whitespace-nowrap ">{name}</h1>
                <h2 className="text-gray-500 whitespace-nowrap">{moment().format("dddd, DD MMMM YYYY")}</h2>
              </div>
              <div className="flex h-full items-end justify-end">
                <div className="flex text-sm text-gray-500 mx-4 items-center gap-2">
                  <NavLink to="/admin/" className={() => ""}>Home</NavLink>
                  <ArrowRight width={14} />
                  <p className="whitespace-nowrap">{name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full h-full">
              <div className="flex w-full h-full">
                {children}
              </div>
              <div className="flex text-gray-500 gap-2 p-4 justify-between bg-white text-xs md:text-sm">
                <p className="flex gap-2">
                  <span className="text-black font-semibold">Hak Cipta © 2025.Team 5R</span>
                  <span>PT. Sarana Makin Mulya.</span>
                </p>
                <p>Versi 1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout