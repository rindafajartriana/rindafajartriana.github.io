import _ from "lodash"
import moment from "moment"

export const remappingFilter = (
  setFilter: any,
  array: any,
  value: any,
  key: any,
  operator: any
) => {
  const filterValue = value ? `${key}~${operator}~${value}` : ""
  const index = _.findIndex(array, (val: any) => val.includes(key))
  if (index === -1) {
    // console.log(key,':',index,array)
    if (value) {
      setFilter(filterValue ? [...array, filterValue] : [...array])
    }
  } else {
    if (filterValue) {
      setFilter((prevState: any) => {
        const temp = [...prevState]
        temp[index] = filterValue
        return temp
      })
    } else {
      setFilter((prevState: any) => {
        const temp = [...prevState]
        temp.splice(index, 1)
        return temp
      })
    }
  }
}

export const remappingFilterUncontroller = (
  array: any,
  value: any,
  key: any,
  operator: any
) => {
  const filterValue = value ? `${key}~${operator}~${value}` : operator === "empty" || operator === "notEmpty" ? `${key}~${operator}` : ""
  const index = _.findIndex(array, (val: any) => val.includes(key))
  if (index === -1) {
    if (value || operator === 'empty' || operator === 'notEmpty') {
      array.push(filterValue)
    }
  } else {
    if (filterValue) {
      const temp = [...array]
      temp[index] = filterValue
      array = temp
    } else {
      const temp = [...array]
      temp.splice(index, 1)
      array = temp
    }
  }
}

interface filterValue {
  value: any
  operator: string
  type: string
  name: string
}

const paramsDateFormat = (date?: string) => {
  const dateValue = date ? date : moment(Date.now()).format("DD-MM-YYYY")
  return moment(dateValue, "DD-MM-YYYY").format("YYYY-MM-DD")
}

export const autoRemapFilter = (filterValue: filterValue[]) => {
  const filter: any[] = []
  _.forEach(filterValue, idx => {
    if (idx.value || idx.operator === "empty" || idx.operator === "notEmpty") {
      let val: any
      if (idx?.operator === "inrange" || idx?.operator === "notinrange") {
        val = _.some(Object?.values(idx?.value)) ? _.map(Object?.values(idx?.value), (x: any) => idx?.type === "date" ? paramsDateFormat(x) : x).join(";") : null
      } else {
        val = idx?.type === "date" ? paramsDateFormat(idx?.value) : idx?.value
      }
      remappingFilterUncontroller(filter, val, idx?.name, idx?.operator)
    }
  })
  return filter
}