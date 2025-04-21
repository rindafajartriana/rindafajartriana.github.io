import { ArrowDown, ArrowUp, EyeIcon } from "@assets/icons/_index"
import { useState } from "react"

interface Input {
  verticalAlign?: "items-start" | "items-center" | "items-end"
  id?: string
  value?: any
  defaultValue?: string
  className?: string
  type?: string
  disabled?: boolean
  placeholder?: string
  onChange?: (e: any) => void
  onBlur?: (e?: any) => void
  name?: string
  innerRef?: string
  onKeyDown?: (e?: any) => void
  invalid?: boolean
  label?: string
  style?: React.CSSProperties
  onClear?: (name: string) => void
  checked?: boolean
  preventShowPassword?: boolean
  icons?:any
}

const Input = ({
  verticalAlign = "items-center",
  id,
  value,
  defaultValue,
  className,
  type,
  disabled,
  placeholder,
  onChange,
  name,
  innerRef,
  onKeyDown,
  onBlur,
  invalid,
  label,
  style,
  onClear,
  checked,
  preventShowPassword=false,
  icons
}: Input) => {

  const [forceType, setForceType] = useState<undefined | "text">(undefined)

  const handleNumberChange = (operator: "up" | "down") => {
    if (operator === "up") {
      value = !value ? "1" : `${Number(value) + 1}`
    } else {
      value = !value ? "-1" : `${Number(value) - 1}`
    }
    onChange?.({
      target: {
        name,
        value: value
      }
    })
  }

  return (
    <div className={`w-full relative flex h-full ${verticalAlign}`}>
      {label &&
        <label className="text-[10.3px] text-gray-800 absolute -top-[8px] h-[14px] left-1 px-[1.5px] bg-white rounded-sm">{label}</label>
      }
      <input
        id={id}
        className={`w-full ${invalid ? "border-red-600" : ""} ${className} form-box ${disabled ? "bg-gray-300" : "bg-white"}`}
        type={forceType ?? (type === "number-custom") ? "text" : type}
        name={name}
        ref={innerRef}
        defaultValue={defaultValue}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        style={style}
        checked={checked}
      />
      {
        value && name && onClear && !disabled ?
          <div className={`absolute ${type === "number-custom" ? "right-[1.35rem]" : "right-1"} text-red-600 cursor-pointer bg-red-100 bg-opacity-90 rounded`}
            onClick={() => onClear?.(name)}
          >
            {/* <CloseIcon width={15} height={15} /> */}
          </div>
          : undefined
      }
      {
        type === "password" && !preventShowPassword &&
        <div className={`absolute right-0 h-full flex items-center justify-center cursor-pointer px-2 ${forceType ? "text-green-600" : " text-gray-800"}`}
          onClick={() => setForceType(p => !p ? "text" : undefined)}
        >
        {/* {icons ?? <EyeIcon width={20} height={20} className={`${forceType ? "text-green-600" : " text-gray-400"}`} />} */}
        {icons ?? <EyeIcon width={18} height={18} />}
        </div>
      }
      {
        type === "number-custom" ?
          <div className="ml-[2px] flex flex-col"
            style={{ height: style?.height }}
          >
            <button className="bg-gray-300 w-4 h-1/2 flex items-center justify-center cursor-pointer  border border-white bg-opacity-60 hover:bg-opacity-100 p-[2px]"
              onClick={() => handleNumberChange("up")}
              disabled={disabled}
            >
              <ArrowDown />
            </button>
            <button className="bg-gray-300 w-4 h-1/2 flex items-center justify-center cursor-pointer  border border-white bg-opacity-60 hover:bg-opacity-100 p-[2px]"
              onClick={() => handleNumberChange("down")}
              disabled={disabled}
            >
              <ArrowUp />
            </button>
          </div>
          : undefined
      }
    </div>
  );
};

export default Input