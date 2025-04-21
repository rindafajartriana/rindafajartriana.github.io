import { useEffect, useRef, useState } from "react"
import _ from "lodash"
import { Options } from "../../type"
import Spinner from "@components/atoms/spinner"
import { CloseIcon } from "@assets/icons/_index"

interface Select {
  keys?: string
  className?: string
  disabled?: boolean
  options?: Options[]
  onSelect?: (val: Options, isCLick?: boolean) => void
  placeholder?: string
  value?: any
  onEndOfData?: () => void
  onActivate?: (v: boolean) => void
  serverMode?: boolean
  isLoading?: boolean
  onSearch?: (v?: string) => void
  required?: boolean
  onClear?: (isClick?: boolean) => void
  invalid?: boolean
}

const defaultValue: any = {
  search: ""
}

const Select2 = ({
  keys,
  className,
  disabled,
  options,
  onSelect,
  placeholder,
  value,
  onEndOfData,
  onActivate,
  serverMode,
  onSearch,
  isLoading,
  required,
  onClear,
  invalid
}: Select) => {
  const ref: any = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [formValue, setFormValue] = useState(defaultValue)
  const [selected, setSelected]: any = useState({})
  const [offset, setOffset] = useState<number | undefined | null>()

  const optionFilter = _.filter(options, (idx) =>
    idx?.label?.toLowerCase()?.includes(formValue?.search)
    || !formValue?.search
  )

  useEffect(() => {
    if (options?.length && !_.isEmpty(selected) && !_.some(options, selected) && !serverMode) {
      deselect()
    }
  }, [options])

  useEffect(() => {
    if (keys) {
      deselect()
    }
  }, [keys])

  useEffect(() => {
    if (value !== undefined) setSelected(_.find(options, { value: value }))
  }, [value, options])

  useEffect(() => {
    if (isOpen) {
      const checkIfClickedOutside = (e: any) => {
        if (isOpen && ref.current && !ref.current.contains(e.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", checkIfClickedOutside)
      return () => {
        // Cleanup the event listener
        document.removeEventListener("mousedown", checkIfClickedOutside)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (onActivate) onActivate(isOpen)
    if (!isOpen) setFormValue((p: any) => ({ ...p, "search": "" }))
  }, [isOpen])


  const deselect = (isClick?: boolean) => {
    handleSelect({})
    if (onClear) onClear(isClick)
    setFormValue(defaultValue)
  }

  const onChange = (e: any) => {
    setFormValue((p: any) => ({
      ...p,
      [e.target.name]: e.target.value
    }))
  }

  const resetSearch = () => {
    setFormValue((p: any) => ({ ...p, search: "" }))
  }

  const handleSelect = (val: any, isClick?: boolean) => {
    if (!_.isEmpty(val)) {
      if (onSelect) onSelect(val, isClick)
      resetSearch()
    }
    setSelected(val)
    setIsOpen(false)
  }

  const handleScroll = (e: any) => {
    if ((e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight) {
      if (onEndOfData) onEndOfData()
    }
  }

  return (
    <div className={`flex-col space-y-1 relative w-full`} ref={ref} >
      <div className={`flex items-center justify-end relative ${disabled ? "bg-gray-300" : "bg-white"}`}>
        <input
          type="text"
          id={!isOpen && !_.isEmpty(selected) ? "inputSelect" : undefined}
          className={`border rounded pl-2 min-h-[2.2rem] ${required ? "" : "pr-10"} py-1 text-sm w-full z-10 bg-transparent overflow-ellipsis ${className} ${invalid ? "border-red-600" : ""}`}
          autoComplete="off"
          autoCorrect="off"
          onFocus={() => setIsOpen(true)}
          // onBlur={() => setIsOpen(false)}
          placeholder={`${isOpen
            ? "Cari..."
            : serverMode && value && !_.some(options, ix => ix?.value === value)
              ? value
              : _.find(options, idx => _.isEqual(idx, selected) || idx?.value === value)?.label ?? placeholder ?? "Select"}`}
          name="search"
          value={formValue?.search}
          onChange={(e) => {
            onChange(e)
            if (onSearch) onSearch(e?.target?.value)
          }}
          disabled={disabled}
          onClick={(e) => setOffset(((window?.innerHeight - e?.clientY) < 100) ? (ref?.current?.offsetTop - 5) : null)}
        />
        <div className="absolute mr-2">
          <div className="flex items-center space-x-3">
            {
              isLoading ?
                <div className="w-4"><Spinner /></div>
                :
                (!_.isEmpty(selected) || formValue?.search) && !disabled && !required ?
                  <div onClick={() => deselect(true)} className="text-red-600 font-mono cursor-pointer z-20 bg-red-100 rounded flex items-center">
                    <CloseIcon width={18} height={18} />
                  </div> : undefined
            }
            <div className={`border-gray-300 border-r-2 border-b-2 h-2 w-2 ${isOpen ? "rotate-[225deg]" : "rotate-45"}`} />
          </div>
        </div>
      </div>
      {
        isOpen && (offset || (offset === null)) ?
          <div
            id="id-select"
            onScroll={(e) => handleScroll(e)}
            className={`bg-white rounded-sm absolute min-w-full max-h-[10rem] overflow-y-auto shadow-[0_5px_15px_-5px_rgba(0,0,0,0.5)] z-50`}
            style={{
              minWidth: ref?.current?.clientWidth,
              // bottom: offset ? (window?.innerHeight - offset) : undefined
            }}
          >
            {optionFilter?.length ?
              _.map(optionFilter, (idx: any, key) => (
                <p
                  key={key}
                  // className={`px-2 py-1 hover:bg-blue-200 ${((selected?.value === idx?.value) || (value === idx?.value)) && "bg-blue-200"}`}
                  className={`cursor-pointer leading-4 px-2 py-1 hover:bg-blue-200 ${(value && value === idx?.value) && "bg-blue-200"} ${!value && selected?.value === idx?.value && "bg-gray-200"}`}
                  onClick={() => handleSelect(idx, true)}
                >
                  {idx?.label}
                </p>
              )) :
              // <p className="p-2 text-gray-500" onClick={() => setIsOpen(false)}>{isLoading ? "loading..." : "no data"}</p>
              !isLoading && <p className="p-2 text-gray-500" onClick={() => setIsOpen(false)}>no data</p>
            }
            {/* {isLoading && <div className="p-2 flex items-center"><Spinner/><p className=" text-gray-500">Mencari data...</p></div>} */}
            {isLoading && <p className="p-2 text-gray-500">Mencari data...</p>}
          </div>
          : undefined
      }
    </div>
  )
}

export default Select2