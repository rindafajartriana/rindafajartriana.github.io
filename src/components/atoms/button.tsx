import { ReactElement } from "react"
import Spinner from "./spinner"

interface Button {
  className?: string
  isLoading?: boolean
  disabled?: boolean
  onClick?: (e: any) => void
  children?: string | ReactElement
  type?: any
}

const Button = ({
  className,
  isLoading,
  disabled,
  onClick,
  children,
  type
}: Button) => {
  return (
    <button
      type={type ?? `button`}
      className={className}
      onClick={onClick}
      disabled={disabled || isLoading}
    >{isLoading && <Spinner />} <span>{children}</span></button>
  )
}

export default Button