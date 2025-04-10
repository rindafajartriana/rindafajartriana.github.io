import { fieldGroupType } from "@components/organisms/globalFormV2"
import _ from "lodash"

const getInputType = (typeField: string, typeData: string) => {
  if (typeField === "TEXT" && typeData === "STRING") {
    return "text"
  } else if (typeField === "TEXT_AREA" && typeData === "STRING") {
    return "textarea"
  } else if (typeField === "TEXT" && typeData === "NUMBER") {
    return "number"
  } else {
    return "text"
  }
}

export const getFieldGroup = (fieldData: any[], index: number) => {
  const newFieldData = fieldData?.[index] ?? []
  const fieldGroup: fieldGroupType[] = _.map(newFieldData?.master_field, idx => {
    let primaryField: fieldGroupType = {
      // name: idx?.nama_field,
      name: `${idx?.id}`,
      label: idx?.alias,
      // type: idx?.tipe_field?.toLowerCase()
      defaultValue: idx?.default_value,
      type: getInputType(idx?.tipe_field, idx?.tipe_data),
      validation: idx?.is_required ? {
        isRequired: true
      } : undefined
    }
    return primaryField
  })
  return fieldGroup
}