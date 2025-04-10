import { useEffect, useState, useCallback, useRef } from "react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import _, { pick } from "lodash";
import filterFunction from '@inovua/reactdatagrid-community/filter';
import moment from "moment";
import PaginationToolbar from '@inovua/reactdatagrid-community/packages/PaginationToolbar';
import Spinner from "../atoms/spinner";
import { TypeColumn } from "@inovua/reactdatagrid-community/types";
import copy from "copy-to-clipboard";

// const gridStyle = { minHeight: '100%', fontSize: '0.7rem' }
const gridStyle = { minHeight: '100%', height: "auto" }
const toArray = (selected: any, dataMap: any) => {
  const keysObj = selected === true ? dataMap : selected
  return Object.keys(keysObj).map(key => Number(key))
}

const getFormatDate = (value?: string, currentFormat?: string, toFormat?: string) => {
  return value ? moment(value, currentFormat ?? "DD-MM-YYYY").format(toFormat ?? "YYYY-MM-DD") : undefined
}
ReactDataGrid.defaultProps.filterTypes.date = {
  ...ReactDataGrid.defaultProps.filterTypes.date,
  emptyValue: '',
  operators: [
    {
      name: 'eq', fn: ({ value, filterValue }) => {
        const date = getFormatDate(filterValue)
        const newValue = getFormatDate(value, "")
        return date ? moment(date).isSame(newValue) : true
      }
    },
    {
      name: 'neq', fn: ({ value, filterValue }) => {
        const date = getFormatDate(filterValue)
        const newValue = getFormatDate(value, "")
        return date ? !moment(date).isSame(newValue) : true
      }
    },
    {
      name: 'inrange', fn: ({ value, filterValue }: any) => {
        const startDate = filterValue?.start ? moment(filterValue?.start, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined
        const endDate = filterValue?.end ? moment(filterValue?.end, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined
        return startDate && endDate ? moment(value).isAfter(startDate) && moment(value).isBefore(endDate) : true
      }
    },
    {
      name: 'notinrange', fn: ({ value, filterValue }: any) => {
        const startDate = filterValue?.start ? moment(filterValue?.start, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined
        const endDate = filterValue?.end ? moment(filterValue?.end, "DD-MM-YYYY").format("YYYY-MM-DD") : undefined
        return startDate && endDate ? moment(value).isAfter(endDate) || moment(value).isBefore(startDate) : true
      }
    },
  ]
}

type largeDataHandling = {
  encodeID: string
  messageData?: string
  isDownloading: boolean
}

type PropsContextMenuType = {
  rowData: any
}

type ContextMenuType = {
  label: string
  onClick: (v: PropsContextMenuType) => void
  disabled?: boolean
}

interface DataGrid {
  idProperty: string
  columns?: TypeColumn[]
  data?: any[]
  loading?: boolean
  defaultLimit?: number
  largeDataHandling?: largeDataHandling
  checkboxColumn?: boolean
  setSelectedId?: (val: number[]) => void
  setSelectedArray?: (val: any[]) => void
  onRowClick?: (val: any) => void
  onRowDoubleClick?: (val: any) => void
  useFilter?: boolean
  onRefresh?: () => void
  rowStyle?: { [key: string]: string | number } | ((...args: any[]) => any) | undefined
  rowClassName?: string
  livePagination?: boolean
  scrollThreshold?: string | number | undefined
  onReady?: () => void
  contextMenu?: ContextMenuType[]
  rowHeight?: number
  onFilterValue? : any
}

const DataGrid = ({
  idProperty,
  columns = [],
  data = [],
  loading,
  defaultLimit = 100,
  largeDataHandling,
  checkboxColumn,
  setSelectedId,
  setSelectedArray,
  onRowClick,
  onRowDoubleClick,
  useFilter,
  onRefresh,
  rowStyle,
  rowClassName,
  livePagination,
  scrollThreshold,
  onReady,
  contextMenu,
  rowHeight,
  onFilterValue
}: DataGrid) => {
  const [limit, setLimit] = useState<number>(defaultLimit)
  const [selected, setSelected]: any = useState({})
  const [unSelected, setUnSelected]: any = useState({})
  const [enableFiltering, setEnableFiltering]: any = useState(false)
  const gridRef: any = useRef(null)
  const [filterValue, setFilterValue]: any[] = useState([])
  const [dataSource, setDataSource]: any[] = useState([])
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const defaultFilter = useFilter ? _.map(columns, idx => {
    return {
      name: idx?.name,
      type: !idx?.type ? "date" : idx?.type,
      operator: !idx?.type ? 'inrange' : idx?.type === "number" ? 'eq' : 'contains',
      // value: (idx?.type === "number") || (!idx?.type) ? undefined : ''
    }
  }) : []

  const onSelectionChange = useCallback(({ selected, unselected }: any) => {
    setSelected(selected)
    setUnSelected(unselected)
  }, [enableFiltering])

  const dataMap: any = gridRef && gridRef?.current && gridRef?.current?.dataMap
    ? gridRef?.current?.dataMap
    : null

  useEffect(() => {
    if (useFilter && columns?.length) {
      // if(!filterValue?.length) setFilterValue(defaultFilter)
      const prevFilter = _.map(filterValue, idx => { return _.pick(idx, ["name", "type"]) })
      const newFilter = _.map(defaultFilter, idx => { return _.pick(idx, ["name", "type"]) })
      if (!_.isEqual(prevFilter, newFilter)) {
        // console.log("render here")
        setFilterValue(defaultFilter)
        setEnableFiltering(true)
      }
    } else {
      setEnableFiltering(false)
    }
  }, [columns])

  // console.log(filterValue, enableFiltering)

  useEffect(() => {
    if (filterValue?.length) {
      setDataSource(filterFunction(data ?? [], filterValue))
    } else {
      setDataSource(data ?? [])
    }
    // setDataSource(data)
    setSelected({})
    // gridRef?.current?.setData(data)
  }, [data])

  useEffect(() => {
    if (checkboxColumn && setSelectedId) {
      setSelectedId(toArray(selected, dataMap))
    }
  }, [selected, dataMap])

  useEffect(() => {
    if (selected && setSelectedArray) {
      setSelectedArray(typeof selected === 'object'
        ? Object.values(selected)
        : _.filter(data, (idx: any) => !_.some(unSelected ? Object.keys(unSelected) : [], ix => Number(ix) === idx.nourut)))
    }
  }, [selected, unSelected])

  const renderColumnContextMenu: any = useCallback((menuProps: any, { cellProps, computedProps }: any) => {
    const newMenuProsItems = _.map(menuProps.items, idx => {
      let newObj = typeof idx === 'object' && idx !== null ? { ...idx } : idx
      if (newObj?.itemId === "columns") {
        newObj.items = _.map(newObj?.items, ix => {
          let newIxObj = { ...ix }
          newIxObj.label = _.find(computedProps?.columns, { name: newIxObj?.name })?.alias ?? newIxObj.label
          return newIxObj
        })
      }
      return newObj
    })
    menuProps.items = newMenuProsItems.concat([
      {
        label: `${enableFiltering ? 'Hide' : 'Show'} Filter`,
        disabled: !useFilter,
        itemId: 'customFilter',
        onClick: () => {
          setEnableFiltering(useFilter ? !enableFiltering : false)
          menuProps.onDismiss()
        }
      }
    ])
    menuProps.items = _.filter(menuProps.items, idx =>
      idx.itemId === "sortAsc"
      || idx.itemId === "sortDesc"
      || idx.itemId === "unsort"
      || idx.itemId === "columns"
      || idx.itemId === "customFilter"
    )
  }, [enableFiltering])


  const onFilterValueChange = useCallback((val: any) => {
    const newData = filterFunction(data ?? [], val)

    setFilterValue(val)
    onFilterValue(val)
    setDataSource(newData)
    setSelected({})
  }, [data, selected])

  const emptyData = () => {
    const id = largeDataHandling?.encodeID ?? ""
    return (
      <div className="flex flex-col items-center gap-2">
        <p>{largeDataHandling?.messageData}</p>
        <a
          className="btn primary flex items-center"
          href={`${import.meta.env.VITE_API_NEW}report/download?id=${id}`}
        >
          {largeDataHandling?.isDownloading && <Spinner />}
          <span>Download File</span>
        </a>
      </div>
    )
  }

  const renderPaginationToolbar = useCallback((paginationProps: any) => {
    const newPaginationToolbar: any = { ...paginationProps }
    newPaginationToolbar.remotePagination = true
    newPaginationToolbar.onRefresh = onRefresh
    return <PaginationToolbar {...newPaginationToolbar} bordered={false} />
  }, [onRefresh])

  const onKeyDown = (e: any, data: any[], selected: any) => {
    // console.log("limit", limit)
    let findIndex: number = _.findIndex(data, Object.values(selected)[0] ?? {})
    if (e.code === "ArrowDown") {
      findIndex = !findIndex && _.isEmpty(selected) ? 0 : findIndex + 1
      if ((findIndex % limit === 0) && findIndex) gridRef?.current?.gotoNextPage()
    }
    else if (e.code === "ArrowUp") {
      findIndex = findIndex - 1
      if ((findIndex + 1) % limit === 0) gridRef?.current?.gotoPrevPage()
    }
    else if (e.code === "ArrowRight") {
      findIndex = findIndex + limit + 1 > data?.length ? data?.length - 1 : findIndex + limit
      gridRef?.current?.gotoNextPage()
    }
    else if (e.code === "ArrowLeft") {
      findIndex = findIndex - limit
      gridRef?.current?.gotoPrevPage()
    }

    const selectedData = data[findIndex]
    setSelected({ [selectedData[idProperty]]: selectedData })
  }

  const renderRowContextMenu = (menuProps?: any, props?: any) => {
    const { rowProps, cellProps, computedProps, computedPropsRef } = props

    const isMultiSelected = (!_.isEmpty(selected) || (selected === true)) && checkboxColumn
    const newSelected = selected === true ? _.reject(data, idx => _.some(Object.keys(unSelected ?? {}) ?? [], ix => Number(ix) === idx?.[idProperty ?? "id"])) : Object.values(selected)
    const jsonValue = isMultiSelected ? newSelected : cellProps?.data
    let sortedA = {};
    rowProps?.columns.forEach((item: any) => {
      if (jsonValue.hasOwnProperty(item.name)) {
        sortedA[item.name] = jsonValue[item.name];
      }
    });

    // const rowString = _.map(Array.isArray(jsonValue) ? jsonValue : [jsonValue], idx => {
    //   return Object.values(idx).map((element) => element ? String(element).trim().replace(/[\r\n]/g, "") : element).join("\t") + "\n"
    // })
    const rowString = _.map(Array.isArray(sortedA) ? sortedA : [sortedA], idx => {
      return Object.values(idx).map((element) => element ? String(element).trim().replace(/[\r\n]/g, "") : element).join("\t") + "\n"
    })

    // setActiveIndex(rowProps.rowIndex)
    menuProps.autoDismiss = true
    const defaultContextMenu = [
      {
        label: `Copy (Text) : ${`${cellProps?.value}`?.substring?.(0,20)}${cellProps?.value?.length > 20 ? "..." : ""}`,
        onClick: () => copy(cellProps?.value)
      },
      // {
      //   label: `Copy (JSON) ${isMultiSelected ? "Selected" : ""}`,
      //   onClick: () => copy(JSON.stringify(jsonValue, null, 2))
      // },
      // {
      //   label: `Copy (Cell Format / Excel)`,
      //   onClick: () => copy(rowString?.join(""), { "format": "text/plain" })
      // }
    ]
    const extendContextMenu: any = _.map(contextMenu, idx => ({ ...idx, onClick: () => idx?.onClick({ rowData: cellProps?.data }) }))
    menuProps.items = defaultContextMenu.concat(extendContextMenu)
  }

  return (
    <ReactDataGrid
      idProperty={idProperty ?? "id"}
      growExpandHeightWithDetails
      // activeIndex={-1}
      activeIndex={activeIndex}
      // onActiveIndexChange={setActiveIndex}
      style={gridStyle}
      // columns={columns ?? []}
      columns={_.map(columns, idx => ({
        ...idx,
        header: typeof idx?.header === 'function' ?
          (props: any, cellProps: any) => idx?.header({
            ...props,
            originalData: data,
            isFiltered: _.some(filterValue, idx => idx?.value)
          }, cellProps)
          : idx?.header
      }))}
      filterValue={filterValue}
      onFilterValueChange={onFilterValueChange}
      pagination
      livePagination={livePagination}
      scrollThreshold={scrollThreshold}
      handle={ref => gridRef.current = ref ? ref?.current : null}
      // selected={checkboxColumn ? selected : false}
      selected={selected}
      // onRowClick={onRowClick ? (e: any) => onRowClick(e?.data) : undefined}
      onRowClick={(e: any) => onRowClick && onRowClick(e?.data)}
      onRowDoubleClick={(e: any) => onRowDoubleClick ? onRowDoubleClick(e) : console.log("doubleClick", e)}
      dataSource={dataSource ?? []}
      // filterRowHeight={35}
      // headerHeight={_.some(columns, idx => typeof idx?.header === 'function') ? 50 : 40}
      // // rowIndexColumn
      // rowHeight={rowHeight ?? 30}
      renderColumnContextMenu={renderColumnContextMenu}
      enableFiltering={(onReady && useFilter) || enableFiltering}
      showFilteringMenuItems={true}
      showColumnMenuFilterOptions={true}
      loading={loading}
      onSelectionChange={onSelectionChange}
      defaultLimit={defaultLimit}
      checkboxOnlyRowSelect={checkboxColumn}
      checkboxColumn={checkboxColumn && columns?.length ? true : false}
      emptyText={largeDataHandling?.encodeID ? emptyData() : undefined}
      // renderPaginationToolbar={typeof onRefresh === 'function' ? renderPaginationToolbar : undefined}
      rowStyle={rowStyle}
      rowClassName={rowClassName}
      onReady={onReady}
      onLimitChange={setLimit}
      onKeyDown={(e) => !checkboxColumn && onKeyDown(e, dataSource, selected)}
      // enableClipboard={true}
      renderRowContextMenu={renderRowContextMenu}
    />
  )
}

export default DataGrid