import { ArrowDown, ArrowUp, Elipsis, SignoutIcon } from "@assets/icons/_index"
import Hamburger from "@components/atoms/hamburger"
import AlertSignOut from "@pages/signin/_signOutPopup"
import { IRootState } from "@store/redux-collection"
import { setIsOpenSidebar } from "@store/redux-collection/dummy"
import { setPopup } from "@store/redux-collection/popup"
import _, { includes } from "lodash"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink, useLocation } from "react-router-dom"

const getRecrusiveMenu = ({ data, flaging, childName }) => {
  const [parentFlag, childFlag] = flaging
  const getData = (id_parent?: number) => _.map(_.filter(data, x => id_parent ? (x?.[childFlag] === id_parent) : !x?.[childFlag] && !x?.hidden), idx => {
    const obj = { ...idx }
    if (getData(idx?.[parentFlag])?.length) {
      obj[childName] = getData(idx?.[parentFlag])
    }
    return obj
  })
  return getData()
}

const RecrusiveSidebar = ({
  data,
  pl,
  location
}) => {
  const defaultOpenId = useMemo(() => _.map(_.filter(data, x => location?.match(`admin/${x?.path}.*`)), x => x?.id), [location])
  const [openId, setOpenId] = useState<any[]>(defaultOpenId)
  const isValid = useCallback((id?: number) => openId?.includes?.(id), [openId])

  return (
    <div className={`${pl ? `bg-opacity-30 bg-slate-700 px-2 pt-[0.7rem] pb-[0.6rem]` : ""} rounded-lg`}>
      {
        _.map(data, (idx, key) => (
          <div key={key} className="">
            <NavLink
              to={idx?.child ? "#" : `/admin/${idx?.path}`}
              className={({ isActive }) => {
                return `
                  ${(isActive && !idx?.child) ? "bg-blue-800 text-white rounded-lg bg-opacity-80" : (isActive && defaultOpenId?.includes?.(idx?.id)) ? "text-blue-300" : ""}
                  flex items-center justify-between w-full whitespace-nowrap overflow-hidden overflow-ellipsis p-2 hover:text-white cursor-pointer
                `
              }}
              onClick={() => {
                idx?.child && setOpenId(p => isValid(idx?.id) ? _.reject(p, x => x === idx?.id) : [...p, idx?.id])
              }}
              style={{
                paddingLeft: pl ? pl : 5
              }}
            >
              <div className="flex gap-2 items-center h-8 px-1">
                {idx.icon ? <idx.icon width={25} /> : <Elipsis width={25} />}
                <p>{idx?.name}</p>
              </div>
              {
                idx?.child ?
                  <div className="w-5 h-5">
                    {isValid(idx?.id) ?
                      <ArrowDown />
                      :
                      <ArrowUp />
                    }
                  </div>
                  : undefined
              }
            </NavLink>
            {
              idx?.child && isValid(idx?.id) &&
              <RecrusiveSidebar data={idx?.child} pl={pl + 10} location={location} />
            }
          </div>
        ))
      }
    </div>
  )
}

const Sidebar = ({ accessType }) => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const location = useLocation()
  // const [isOpen, setIsOpen] = useState<boolean | undefined>()
  const { isOpenSidebar: isOpen } = useSelector((state: IRootState) => state.dummy)
  const { privateRoutes } = useSelector((state: IRootState) => state.dummy)
  const { userInfo } = useSelector((state: IRootState) => state.signIn.data)
  const sidebarData = useMemo(() => getRecrusiveMenu({
    data: _.filter(privateRoutes, x => x?.access?.view?.includes?.(userInfo?.access_type)),
    flaging: ["id", "id_parent"],
    childName: "child"
  }), [userInfo?.access_type])
  const getInitial = useMemo(() => `${userInfo?.fullname ?? ""}`.charAt?.(0), [userInfo?.fullname])

  useLayoutEffect(() => {
    if ((isOpen === undefined) && ref?.current) onSetOpen(ref?.current?.clientWidth > 48 ? true : false)
  }, [])

  const onSetOpen = (value: boolean) => {
    // setIsOpen(value)
    dispatch(setIsOpenSidebar(value))
  }

  // useEffect(() => {
  //   if (isOpen) {
  //     const checkIfClickedOutside = (e: any) => {
  //       if (isOpen && ref.current && !ref.current.contains(e.target)) {
  //         // console.log("tutup action")
  //         onSetOpen(false)
  //       }
  //     }
  //     document.addEventListener("mousedown", checkIfClickedOutside)
  //     return () => {
  //       // Cleanup the event listener
  //       document.removeEventListener("mousedown", checkIfClickedOutside)
  //     }
  //   }
  // }, [isOpen]) //eslint-disable-line

  return (
    // <div ref={ref} className={`flex flex-col h-[calc(100%-44px)] md:h-full md:relative fixed bg-slate-900 shadow z-20 shadow-black text-gray-400 transition-all duration-200 ease-in-out ${isOpen === true ? "w-[24rem]" : isOpen === false ? "w-0" : "w-0 md:w-[26rem]"}`}>
    <div ref={ref} className={`flex flex-col h-[calc(100%-44px)] md:h-full md:relative fixed bg-slate-900 shadow z-30 shadow-black text-gray-400 transition-all duration-200 ease-in-out ${isOpen === true ? "w-[24rem]" : isOpen === false ? "w-0" : "w-0 md:w-[26rem]"}`}>
      <div className="flex m-1 justify-end">
        <div className={`flex items-center h-10  absolute w-full justify-start md:justify-end cursor-pointer -top-11 -right-0 md:-right-11`}>
          <Hamburger isOpen={isOpen} setIsOpen={(v: boolean) => onSetOpen(v)} />
        </div>
      </div>
      <div className="absolute w-full h-full overflow-y-auto pt-5"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col h-full">
          <div className="visible mx-5 min-h-[3.3rem] md:min-h-0 pb-1 md:invisible md:h-0 md:p-0 mb-3 md:mb-0 cursor-pointer rounded-lg bg-slate-800 hover:bg-blue-600 hover:bg-opacity-30 text-white overflow-hidden">
            <NavLink to="/admin/profile" className={({ isActive }) => `p-2 flex items-center gap-2 ${isActive ? "bg-blue-800 text-white" : ""}`}>
              <div className="min-w-[2.3rem] h-[2.3rem] bg-gray-400 flex items-center justify-center rounded-full">{getInitial}</div>
              <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">{userInfo?.fullname}</div>
            </NavLink>
          </div>
          <div className="px-5 pb-5">
            <RecrusiveSidebar data={sidebarData} pl={0} location={location?.pathname} />
            <div
              className="text-red-300 mt-4 md:h-0 visible md:invisible cursor-pointer flex gap-2 px-2 py-2 bg-slate-800 hover:bg-slate-500 rounded "
              onClick={() => dispatch(setPopup({
                type: "warning",
                title: "Peringatan",
                id: "signoutalert",
                content: () => <AlertSignOut />,
                noButton: true,
                containerClass: "w-fit"
              }))}
            >
              <SignoutIcon width={26} />
              <p>Keluar</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar