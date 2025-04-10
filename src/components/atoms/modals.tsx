import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

type Modals = {
  isOpen: boolean
  setIsOpen?: (e: boolean) => void
  children?: any
  preventClose?: boolean
  preventOutsideClose?: boolean
  classContainer?: string
}

const Modals = ({
  isOpen,
  setIsOpen,
  children,
  preventClose,
  classContainer,
  preventOutsideClose
}: Modals) => {

  const ref: any = useRef()
  const { data } = useSelector((state: any) => state.alert)

  useEffect(() => {
    if (isOpen && !preventClose && !data?.length && !preventOutsideClose) {
      const checkIfClickedOutside = (e: any) => {
        if (isOpen && ref.current && !ref.current.contains(e.target)) {
          // console.log("tutup action")
          if (setIsOpen) setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", checkIfClickedOutside)
      return () => {
        // Cleanup the event listener
        document.removeEventListener("mousedown", checkIfClickedOutside)
      }
    }
  }, [isOpen, preventClose, data?.length]) //eslint-disable-line

  return isOpen ? (
    <div className='custom-modal fixed z-[99] inset-0 w-screen bg-slate-950 bg-opacity-50 backdrop-blur-sm'>
      <div className='relative flex items-center justify-center w-full h-full'>
        <div ref={ref} className={`bg-white relative rounded w-fit m-2 lg:m-0 ${classContainer}`} >
          <div onClick={() => setIsOpen ? setIsOpen(false) : undefined} className="absolute w-fit h-fit flex right-[10px] top-[10px] cursor-pointer bg-white p-1 rounded border shadow">
            <svg className="h-3 w-3 text-red-200" viewBox="0 -0.5 21 21" version="1.1">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -240.000000)" fill="#000000">
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <polygon id="close-[#1511]" points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446">
                    </polygon>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          {children}
        </div>
      </div>
    </div>
  ) : null
}
export default Modals