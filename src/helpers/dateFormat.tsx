import moment from "moment"

export const dateFormat = (date: any, format: string) => {
  if (format === "en") {
    format = "MMM Do YYYY"
  }
  else if (format === "jp") {
    format = "YYYY年 MM月 DD日"
  }
  else if (format === "id") {
    format = "DD/MM/YYYY HH:mm"
  }
  else if (format === "std") {
    format = "YYYY-MM-DD"
  }
  else if (format === "id-custom") {
    const day = moment(date).format("MM")
    const month = moment(date).format("DD")
    const years = moment(date).format("YYYY")
    const hours = moment(date).format("H")
    const minutes = moment(date).format("mm")
    return `${day}/${month}/${years}` //special for faktur pajak page
  }
  else {
    format = "MMM Do YYYY"
  }

  return moment.utc(date).format(format)
}