import { BellIcon, MessageIcon } from "@assets/icons/_index"
import Button from "@components/atoms/button"
import Img from "@components/atoms/img"
import { baseUrl } from "@helpers"
import DetailPesan from "@pages/history-laporan/_detail"
import AlertSignOut from "@pages/signin/_signOutPopup"
import { IRootState } from "@store/redux-collection"
import { useGetListNotifAllQuery, useGetListNotifQuery, useGetListPesanQuery, usePostNotifMutation, usePostReadPesanMutation } from "@store/redux-collection/pesan"
import { setPopup } from "@store/redux-collection/popup"
import { signOut } from "@store/redux-collection/sign-in"
import { AnyObj } from "@type"
import _ from "lodash"
import moment from "moment"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, NavLink } from "react-router-dom"

const Navbar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  // const refPopup = useRef<HTMLDivElement>(null)
  const [currentWidth, setCurrentWidth] = useState(0)
  const { userInfo } = useSelector((state: IRootState) => state.signIn.data)
  const getInitial = useMemo(() => `${userInfo?.fullname ?? ""}`.charAt?.(0), [userInfo?.fullname])

  useLayoutEffect(() => {
    if (ref?.current) setCurrentWidth(ref?.current?.clientWidth - 291)
  })

  useEffect(() => {
    if (isOpen) {
      const checkIfClickedOutside = (e: any) => {
        if (isOpen && ref.current && !ref.current.contains(e.target)) {
          if (setIsOpen) setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", checkIfClickedOutside)
      return () => {
        document.removeEventListener("mousedown", checkIfClickedOutside)
      }
    }
  }, [isOpen]) //eslint-disable-line

  return (
    <div className="relative md:w-fit md:h-full overflow-hidden md:overflow-visible" ref={ref}>
      <div className="h-full flex items-center px-4 w-fit max-w-[230px] gap-2 hover:bg-blue-800 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-slate-800 flex items-center justify-center w-8 h-8 rounded-full uppercase text-sm">
          {getInitial}
        </div>
        <p className="whitespace-nowrap overflow-hidden overflow-ellipsis text-sm">{userInfo?.fullname}</p>
      </div>
      {
        isOpen ?
          <div className="flex flex-col absolute gap-3  z-10 top-[2.8rem] w-[18rem] h-fit bg-slate-800 shadow-lg shadow-gray-500 p-6 rounded-b text-gray-500"
            style={{ left: `${currentWidth + 2}px` }}
          >
            <div className="flex flex-col w-full items-center pb-2 gap-4">
              {
                userInfo?.image_url ?
                  <Img className="w-32 h-32 rounded-full object-cover" src={userInfo?.image_url} />
                  :
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center uppercase">{getInitial}</div>
              }
              <div className="flex flex-col text-center text-gray-400 text-sm gap-1">
                <p className="text-lg text-white">{userInfo?.fullname}</p>
                {/* <p>Tanggal Bergabung : {moment().format("DD-MM-YYYY HH:mm:ss")}</p> */}
                <p>{userInfo?.jabatan}</p>
                <p>{userInfo?.department}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <NavLink
                to="/admin/profile"
                className={() => "btn color-primary"}
                onClick={() => setIsOpen(false)}
              >Profile</NavLink>
              <Button className="btn color-secondary"
                // onClick={() => dispatch(signOut())}
                onClick={() => dispatch(setPopup({
                  type: "warning",
                  title: "Peringatan",
                  id: "signoutalert",
                  content: () => <AlertSignOut />,
                  noButton: true,
                  containerClass: "w-fit"
                }))}
              >Keluar</Button>
            </div>
          </div> : undefined
      }
    </div>
  )
}

const Message = () => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { data, isFetching, refetch } = useGetListPesanQuery({ type: "inbox", params: { is_unread: true } }, {
    // skip: !isOpen, 
    refetchOnMountOrArgChange: true
  })
  const [postRead] = usePostReadPesanMutation()

  useEffect(() => {
    if (isOpen) {
      const checkIfClickedOutside = (e: any) => {
        if (isOpen && ref.current && !ref.current.contains(e.target)) {
          if (setIsOpen) setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", checkIfClickedOutside)
      return () => {
        document.removeEventListener("mousedown", checkIfClickedOutside)
      }
    }
  }, [isOpen]) //eslint-disable-line

  const onLihat = (detail: AnyObj) => {
    dispatch(setPopup({
      title: "Detail Pesan",
      containerClass: "md:w-[30rem]",
      id: "detailPesan",
      content: () => <DetailPesan data={detail} type={"inbox"} />,
      noButton: true
    }))
  }

  const onRead = () => {
    postRead({})
  }

  return (
    <div ref={ref}>
      <div className="relative hover:bg-blue-800 hover:bg-opacity-50 p-1 rounded-full hover:cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen)
          onRead()
        }}
      >
        {data?.data?.length ?
          <p className="absolute bg-red-700 text-xs w-5 h-5 flex justify-center items-center rounded-full -right-1 -top-1">{data?.data?.length < 10 ? data?.data?.length : "9+"}</p>
          : undefined
        }
        <MessageIcon width={24} height={24} />
      </div>
      {
        isOpen &&
        <div className="absolute font-roboto-condensed font-thin bg-white text-gray-500 text-xs w-[20rem] right-1 top-[3rem] rounded-b shadow shadow-gray-500">
          <div className="max-h-[10rem] overflow-y-auto">
            {data?.data?.length ?
              _.map(data?.data, x => (
                <div className="border-b p-2 overflow-hidden cursor-pointer bg-gray-300 bg-opacity-30 flex gap-2"
                  onClick={() => onLihat(x)}
                >
                  <p className=" whitespace-nowrap">[{x?.username_from}] :</p>
                  <p className=" whitespace-nowrap overflow-hidden overflow-ellipsis">({x?.judul}) {x?.isi}</p>
                </div>
              )) : <p className="p-2 border-b">Kamu tidak memiliki pesan baru</p>
            }
          </div>
          <div className="flex text-center">
            <Link to="/admin/pesan" onClick={() => setIsOpen(false)} className="p-2 cursor-pointer hover:bg-green-100  w-full" >Lihat Semua Pesan</Link>
          </div>
        </div>
      }
    </div>
  )
}

const DetailNotif = ({ data }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <p>[{data?.sender_name}]</p>
        <p>{moment(data?.tanggal).format("DD-MM-YYYY")}</p>
      </div>
      <p className="text-gray-700">{data?.nama_kegiatan}</p>
    </div>
  )
}

const Notification = () => {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { data: dataUnread, isFetching: isLoadingUnread, refetch: refetchUnread } = useGetListNotifQuery({ type: "unread" }, {
    refetchOnMountOrArgChange: true
  })
  const { data, isFetching, refetch } = useGetListNotifAllQuery({ page: 1, limit: 20 }, {
    refetchOnMountOrArgChange: true
  })
  const [postNotif] = usePostNotifMutation()
  const totalUnread = useMemo(() => _.filter(data?.data, { is_read: 0 })?.length, [data?.data])

  useEffect(() => {
    if (isOpen) {
      const checkIfClickedOutside = (e: any) => {
        if (isOpen && ref.current && !ref.current.contains(e.target)) {
          if (setIsOpen) setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", checkIfClickedOutside)
      return () => {
        document.removeEventListener("mousedown", checkIfClickedOutside)
      }
    }
  }, [isOpen]) //eslint-disable-line

  const onLihat = (detail: AnyObj) => {
    if (detail?.is_read === 0) {
      postNotif({
        "read_all": false,
        "notif_id": [detail?.id]
      })
        .unwrap()
    }
    dispatch(setPopup({
      title: "Detail Notifikasi",
      containerClass: "md:w-[30rem]",
      id: "detailPesan",
      content: () => <DetailNotif data={detail} />,
      noButton: true
    }))
  }
  return (
    <div ref={ref}>
      <div className="relative hover:bg-blue-800 hover:bg-opacity-50 p-1 rounded-full hover:cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {
          totalUnread ?
            <p className="absolute bg-red-700 text-xs w-5 h-5 flex justify-center items-center rounded-full -right-1 -top-1">
              {totalUnread < 10 ? totalUnread : "9+"}
            </p> : undefined
        }
        <BellIcon width={24} height={24} />
      </div>
      {
        isOpen &&
        <div className="absolute font-roboto-condensed font-thin bg-white text-gray-500 text-xs w-[20rem] right-1 top-[3rem] rounded-b shadow shadow-gray-500">
          <div className="max-h-[10rem] overflow-y-auto">
            {data?.data?.length ?
              _.map(data?.data, x => (
                <div className="border-b p-2 overflow-hidden cursor-pointer bg-gray-300 bg-opacity-30 flex gap-2"
                  // onClick={() => onLihat(x)}
                  // onMouseOver={() => (x?.is_read === 0) && onLihat(x)}
                  onClick={() => onLihat(x)}
                >
                  <p className=" whitespace-nowrap">[{x?.sender_name}] :</p>
                  <p className=" whitespace-nowrap overflow-hidden overflow-ellipsis">({moment(x?.tanggal).format("DD-MM-YYYY")}) {x?.nama_kegiatan}</p>
                </div>
              )) : <p className="p-2 border-b">Kamu tidak memiliki notifikasi baru</p>
            }
          </div>
          {/* <div className="flex text-center">
            <Link to="/admin/pesan" onClick={() => setIsOpen(false)} className="p-2 cursor-pointer hover:bg-green-100  w-full" >Lihat Semua Pesan</Link>
          </div> */}
        </div>
      }
    </div>
  )
}

const Topbar = () => {
  const { isOpenSidebar } = useSelector((state: IRootState) => state.dummy)
  const [isOpen, setIsOpen] = useState(false)
  return (
    // <div className={`h-11 bg-gradient-to-r from-green-700 to-green-600 shadow shadow-black z-20 flex text-xl font-bold text-white ${!isOpenSidebar ? "pl-12" : "pl-12 md:pl-6"}`}>
    //   <div className="flex justify-between w-full items-center">
    <div className={`h-11 z-20 flex text-xl font-bold text-white mb-1`}>
      <div className={`flex h-11 justify-between w-full items-center bg-gradient-to-r from-blue-800 to-blue-500 shadow shadow-black fixed ${!isOpenSidebar ? "pl-12" : "pl-12 md:pl-6"}`}>
        <div className="flex gap-2 items-center">
          {/* <Img src={baseUrl("/img/5r.png")} className="w-7 h-7" /> */}
          <p className="py-2 text-[2rem] font-roboto-condensed">CekPremi</p>
        </div>
        <div className="flex items-center h-full gap-2 mr-2">
          <Message />
          <Notification />
          <div className="invisible md:visible h-0 md:w-fit w-0 md:h-full">
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar