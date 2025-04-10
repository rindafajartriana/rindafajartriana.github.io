import { useEffect, useRef, useState } from "react"
import _ from "lodash"
import { Options } from "../../type"

interface Select {
  className?: string
  disabled?: boolean
  options?: Options[]
  onSelect?: (val?: object) => void
  placeholder?: string
  value?: any
}

const defaultValue: any = {
  search: ""
}

const Select = ({
  className,
  disabled,
  options,
  onSelect,
  placeholder,
  value
}: Select) => {
  const ref: any = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const [formValue, setFormValue] = useState(defaultValue)
  const [selected, setSelected]: any = useState({})

  const optionFilter = _.filter(options, (idx) =>
    idx?.label?.toLowerCase().includes(formValue?.search?.toLowerCase())
    // || idx?.value?.toLowerCase()?.includes(formValue?.search)
    || !formValue?.search
  )

  useEffect(() => {
    if (options?.length && !_.isEmpty(selected) && !_.some(options, selected)) {
      deselect()
    }
  }, [options])

  useEffect(() => {
    // if (value !== undefined) setFormValue((p: any) => ({ ...p, search: _.find(options, { value: value })?.label }))
    if (value !== undefined) setSelected(_.find(options, { value: value }))
  }, [value])

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

  const deselect = () => {
    handleSelect({})
    if (onSelect) onSelect({})
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

  const handleSelect = (val: any) => {
    if (!_.isEmpty(val)) {
      if (onSelect) onSelect(val)
      resetSearch()
    }
    setSelected(val)
    setIsOpen(false)
  }

  return (
    <div className={`flex-col space-y-1 relative`} ref={ref} >
      <div className={`flex items-center justify-end relative ${disabled ? "bg-gray-300" : "bg-white"}`}>
        <input
          type="text"
          id={!isOpen && !_.isEmpty(selected) ? "inputSelect" : undefined}
          className={`form-box w-full z-10 bg-transparent ${className}`}
          autoComplete="off"
          autoCorrect="off"
          onFocus={() => setIsOpen(true)}
          // onBlur={() => setIsOpen(false)}
          placeholder={`${isOpen ? "Cari..." : _.find(options, idx => _.isEqual(idx, selected) || idx?.value === value)?.label ?? placeholder ?? "Select"}`}
          name="search"
          value={formValue?.search}
          onChange={(e) => onChange(e)}
          disabled={disabled}
        />
        <div className="absolute mr-2">
          <div className="flex items-center space-x-3">
            {(!_.isEmpty(selected) || formValue?.search) && !disabled ? <div onClick={() => deselect()} className="text-red-600 font-mono cursor-pointer z-20">x</div> : undefined}
            <div className={`border-gray-300 border-r-2 border-b-2 h-2 w-2 ${isOpen ? "rotate-[225deg]" : "rotate-45"}`} />
          </div>
        </div>
      </div>
      {
        isOpen ?
          <div id="id-select" className={`bg-white rounded-sm absolute w-full max-h-[10rem] overflow-y-auto shadow-[0_5px_15px_-5px_rgba(0,0,0,0.5)] z-50`}>
            {optionFilter?.length ?
              _.map(optionFilter, (idx: any, key) => (
                <p
                  key={key}
                  // className={`px-2 py-1 hover:bg-blue-200 ${((selected?.value === idx?.value) || (value === idx?.value)) && "bg-blue-200"}`}
                  className={`cursor-pointer px-2 py-1 hover:bg-blue-200 ${(value && value === idx?.value) && "bg-blue-200"} ${!value && selected?.value === idx?.value && "bg-gray-200"}`}
                  onClick={() => handleSelect(idx)}
                >
                  {idx?.label}
                </p>
              )) :
              <p className="p-2 text-gray-500" onClick={() => setIsOpen(false)}>no data</p>
            }
          </div>
          : undefined
      }
    </div>
  )
}

export default Select