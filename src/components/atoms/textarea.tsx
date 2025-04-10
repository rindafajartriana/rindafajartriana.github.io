interface TextArea {
  id?: string
  className?: string
  placeholder?: string
  onChange?: (e: any) => void
  value?: any
  rows?: number
  cols?: number
  children?: any
  name?: string
  disabled?: boolean
  invalid?: boolean
  onKeyDown?: (e?: any) => void
}

const TextArea = ({
  id,
  className,
  onChange,
  value,
  rows,
  cols,
  children,
  name,
  disabled,
  invalid,
  onKeyDown,
  placeholder
}: TextArea) => {
  return (
    <textarea
      id={id}
      name={name}
      className={`form-box ${invalid ? "border-red-600" : ""} w-full ${className} ${disabled && "bg-gray-500 bg-opacity-30"}`}
      onChange={onChange}
      value={value}
      rows={rows}
      cols={cols}
      disabled={disabled}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    >
      {children}
    </textarea>
  )
}

export default TextArea