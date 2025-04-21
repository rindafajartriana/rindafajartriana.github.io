
export const shrinkageTypeData = (value:string) => {
  let typeData = ""
  switch (value?.toLowerCase()) {
    case "panjang shrinkage":
      typeData = "DECIMAL"
      break
    case "lebar shrinkage":
      typeData = "DECIMAL"
      break
    case "spirality":
      typeData = "DECIMAL"
      break
    default:
      typeData = "STRING"
      break
  }

  return typeData
}