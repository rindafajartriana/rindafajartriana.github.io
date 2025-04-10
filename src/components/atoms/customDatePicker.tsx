import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

interface CustomDatePicker {
  onChange?: (e: any) => void
  selected?: any
  dateFormat?: string
  showMonthYearPicker?: boolean
}

const CustomDatePicker = ({
  onChange,
  selected,
  dateFormat,
  showMonthYearPicker
}: CustomDatePicker) => {
  return (
    <DatePicker
      showIcon
      selected={selected}
      className="border-2 rounded h-[2rem] px-2 text-xs"
      placeholder="dd/mm/yyyy"
      onChange={onChange}
      dateFormat={dateFormat ?? "dd/MM/yyyy"}
      showMonthYearPicker={showMonthYearPicker}
    />
  )
}

export default CustomDatePicker