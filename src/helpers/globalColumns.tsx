import _, { isEmpty } from "lodash"
import NumberFilter from "@inovua/reactdatagrid-community/NumberFilter"
import DateFilter from "@inovua/reactdatagrid-community/DateFilter"
import { dateFormat } from "./dateFormat"
import { TypeColumns } from "@inovua/reactdatagrid-community/types/TypeColumn"
import { isValidElement } from "react"

type ExtendField = {
  name: string
  value: ((data?: any[], originalData?: any[]) => string | number | undefined) | string | number | undefined
}

type ValueProps = {
  rawValue?: string
  rowData?: any
}

type AnyValueType = string | number | undefined | HTMLElement | JSX.Element | void

interface ExtraPropsType {
  isAutoHeader?: boolean
  autoSummary?: boolean
  data?: any[]
  originalData?: any[]
  isFiltered?: boolean
  name?: string
  colsAlias?: ColumnsAliasType[]
  filterColumnsByAlias?: boolean
  wrap?: boolean
}

type RenderProps = {
  wrap?: boolean
  value?: ((v?: any, props?: ValueProps | undefined) => AnyValueType) | string | number | undefined
}

export type ColumnsType = {
  fieldName: string
  dataType: "STRING" | "INTEGER" | "DECIMAL" | "DATE" | "DATEONLY" | "DATETIME" | "TIME"
  alias?: string
  decimalComma?: number
  order?: number,
  wrap?: boolean
  defaultWidth?: number
  render?:any
}

export type ColumnsAliasType = {
  index?: string
  dataType?: "STRING" | "INTEGER" | "DECIMAL" | "DATE" | "DATEONLY" | "DATETIME" | "TIME"
  wrap?: boolean
  alias?: string
  order?: number
  extendField?: ExtendField[]
  render?: RenderProps
  defaultWidth?: number
}

type GlobalColumnsTypes = (cols: ColumnsType[], extraProps?: ExtraPropsType) => TypeColumns
type GlobalColumnsAliasTypes = (cols: ColumnsType[], colsAlias?: ColumnsAliasType[], filterColumnsByAlias?: boolean) => (ColumnsType & ColumnsAliasType)[]

export const getDataType = (value: string) => {
  switch (value) {
    case "INTEGER":
      return "number"
    case "DECIMAL":
      return "number"
    case "STRING":
      return "string"
    case "DATE":
      return "date"
    case "DATEONLY":
      return "date"
    case "DATETIME":
      return "date"
    case "TIME":
      return "string"
    default:
      return value;
  }
}

const getAliasColumns: GlobalColumnsAliasTypes = (columns, columnsAlias, filterColumnsByAlias) => {
  const newColumns = filterColumnsByAlias ? _.filter(columns, idx => _.some(columnsAlias, ix => ix.index === idx.fieldName)) : [...columns]
  if (!columnsAlias?.length) {
    return newColumns
  } else {
    return _.map(newColumns, idx => {
      const findColumns = _.find(columnsAlias, { index: idx?.fieldName })
      return {
        ...idx,
        alias: findColumns?.alias,
        order: findColumns?.order,
        wrap: findColumns?.wrap,
        extendField: findColumns?.extendField,
        render: findColumns?.render,
        defaultWidth: findColumns?.defaultWidth ?? idx?.defaultWidth,
        dataType: findColumns?.dataType ?? idx?.dataType
      }
    })
  }
}

const getValueNumber = ({ originalData, data, name, cols, isFiltered }) => {
  const totalAll = `${_.sumBy(originalData, name)?.toLocaleString("id-ID", { minimumFractionDigits: cols?.decimalComma ?? 0 }) ?? 0}`
  const totalFilter = `${_.sumBy(data, name)?.toLocaleString("id-ID", { minimumFractionDigits: cols?.decimalComma ?? 0 }) ?? 0}`
  return `${totalAll} ${isFiltered ? `(${totalFilter})` : ''}`
}

const getHeader = (headerName: string, cols: ColumnsType & ColumnsAliasType, { autoSummary, data, originalData, isFiltered, name, wrap }: ExtraPropsType) => {
  const totalField = autoSummary && getDataType(cols.dataType) === "number" ? {
    name: "Total",
    value: getValueNumber({ originalData, data, name, cols, isFiltered })
  } : {}
  const combinedField = isEmpty(totalField) ? cols?.extendField : [totalField, ...cols?.extendField ?? []]

  return (
    <div className="w-full h-full -mr-10 ">
      <div className="ex-header right-10 absolute inset-0 ">
        <div className="flex flex-col px-1 h-full w-full justify-between ">
          <div className="flex flex-col justify-center h-full w-full overflow-y-auto ml-2">
            <p className={`leading-[.85rem] ${wrap || cols?.wrap ? "whitespace-pre-wrap overflow-y-auto" : "overflow-hidden overflow-ellipsis"}`}>{headerName}</p>
          </div>
          {
            combinedField?.length ?
              <div className="leading-[0.8rem] h-[1.28rem] overflow-y-auto">
                {
                  _.map(combinedField, (idx, key) => (
                    <div key={key} className="text-right flex justify-between text-blue-400">
                      <p className="pr-2">{idx?.name}</p>
                      <p className="overflow-hidden overflow-ellipsis">
                        {typeof idx?.value === 'function' ? idx?.value(data, originalData) : idx?.value ?? ""}
                      </p>
                    </div>
                  ))
                }
              </div>
              : undefined
          }
        </div>
      </div>
    </div>
  )
}

const getRender = (cols: ColumnsType & ColumnsAliasType, props: any) => {
  const { value, cellProps: { type, style, data } } = props
  // console.log("props", data)
  let aliasRender = cols?.render
  let newValue: any
  if (getDataType(cols.dataType) === "date") newValue = value ? dateFormat(value, "id") : ""
  else if (type === "number" && cols.dataType === "DECIMAL") newValue = value?.toLocaleString("id-ID", { minimumFractionDigits: cols?.decimalComma ?? 0 })
  else newValue = value

  let aliasValue: any
  if (aliasRender?.value) {
    if (typeof aliasRender?.value === 'function') {
      aliasValue = aliasRender?.value(newValue, { rawValue: value, rowData: data })
      // } else if (isValidElement(aliasRender?.value)) {
      //   return aliasRender?.value
    } else {
      aliasValue = aliasRender?.value
    }
  } else {
    aliasValue = newValue
  }

  if (aliasRender?.wrap) {
    return (
      <div className="w-full max-h-[2rem] overflow-x-hidden overflow-y-auto whitespace-pre-wrap leading-3">
        {aliasValue}
      </div>
    )
  } else {
    return aliasValue
  }
}

// export const getGlobalColumns = (columnsList: ColumnsType[], { isAutoHeader, autoSummary }: ExtraPropsType) => {
export const getGlobalColumns: GlobalColumnsTypes = (columnsList = [], extraProps) => {
  const { isAutoHeader, autoSummary, colsAlias, filterColumnsByAlias, wrap } = extraProps ?? {}
  const newColumns = getAliasColumns(columnsList, colsAlias, filterColumnsByAlias)

  const dataGridColumns: TypeColumns = _.map(newColumns, (idx, key) => {
    const headerName = idx.alias ? idx.alias : isAutoHeader ? _.capitalize(idx.fieldName.replace(/_/g, " ")) : idx.fieldName
    return {
      name: idx.fieldName,
      alias: headerName,
      // header: ({ data, name }) => `${headerName} ${getDataType(idx.dataType) === "number" ? `(${_.sumBy(data, name)})` : ""} `,
      // header: (props, test) => console.log("props",  test),
      header: wrap || idx?.wrap || autoSummary || idx?.extendField?.length ?
        ({ data, name, originalData, isFiltered }) => getHeader(headerName, idx, { autoSummary, data, originalData, isFiltered, name, wrap })
        : headerName,
      type: getDataType(idx.dataType) !== "date" ? getDataType(idx.dataType) : undefined,
      filterEditor: getDataType(idx.dataType) === "number" ? NumberFilter : getDataType(idx.dataType) === "date" ? DateFilter : undefined,
      filterEditorProps: (props: any, { index }) =>
        getDataType(idx.dataType) === "date" ? {
          dateFormat: 'DD-MM-YYYY',
          placeholder: index === 1 ? 'End' : 'Start'
        } : undefined,
      defaultFlex: !idx?.defaultWidth ? newColumns?.length < 7 ? 1 : 0 : undefined,
      // defaultFlex: (newColumns?.length < 4) && !idx?.defaultWidth ? 1 : undefined,
      defaultWidth: idx?.defaultWidth,
      render: (props) => getRender(idx, props),
      headerAlign: 'start',
      textAlign: getDataType(idx.dataType) === "number" || getDataType(idx.dataType) === "date" ? "end" : "start",
      headerProps: {
        style: {
          color: '#172554',
          fontWeight: 'bold',
          // minHeight: "3rem" 
          // minHeight: 48 
        }
      },
      order: idx?.order
    }
  })
  return dataGridColumns?.length ? _.orderBy(dataGridColumns, ["order"], ["asc"]) : []
}