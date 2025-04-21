import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { getGlobalColumns } from "@helpers/globalColumns";
import { autoRemapFilter } from "../../helpers/remappingFilter";
import filterFunction from '@inovua/reactdatagrid-community/filter';
import { useDispatch, useSelector } from "react-redux";
import { resetReloadGrid } from "@store/redux-collection/data-grid";
import { TypeComputedProps } from "@inovua/reactdatagrid-community/types";
import copy from "copy-to-clipboard";

type DynamicObjectType = {
  [key: string]: any
}

type MutationPropsTypes = {
  [key: string]: any
}

interface ConfigMutation {
  skip: boolean
}

type PropsContextMenuType = {
  rowData: any
}

type ContextMenuType = {
  label: string
  onClick: (v: PropsContextMenuType) => void
}

interface ReactDataGridType {
  idProperty?: string | "autoId"
  columns?: any[]
  defaultLimit?: number
  checkboxColumn?: boolean | undefined
  useFilter?: boolean
  useMutation: () => any
  configMutation?: ConfigMutation
  params: DynamicObjectType
  onFetching?: (val: MutationPropsTypes) => void
  onRowSelected?: (val?: DynamicObjectType) => void
  onCheckboxSelected?: (val: DynamicObjectType) => void
  autoColumns?: boolean
  columnsAlias?: any[]
  filterColumnsByAlias?: boolean
  onDataChange?: () => void
  localFilter?: boolean
  allowRefetch?: boolean
  rowHeight?: number
  onReady?: ((computedPropsRef: React.MutableRefObject<TypeComputedProps | null>) => void) | undefined
  disableFilterList?: string[]
  defaultSelected?: string[]
  autoSummary?: boolean
  reducerGrid?: string
  rowClassName?: string | ((...args: any[]) => string | undefined) | undefined
  contextMenu?: ContextMenuType[]
  autoHeader?: boolean
  rememberFilterOnRefetch?: boolean
}

const sortFunction = (arr: any, sortInfo: any) => {
  arr = [].concat(arr)
  if (!sortInfo) {
    return arr
  }
  return arr.sort((o1: any, o2: any) => {
    const v1 = o1[sortInfo.name]
    const v2 = o2[sortInfo.name]

    const result = sortInfo.type == 'number'
      ? v1 - v2
      : v1.localeCompare(v2)

    return result * sortInfo.dir
  })
}

const gridStyle = { minHeight: '100%', fontSize: '0.7rem' }
const defaultData = {
  data: [],
  count: 0
}

const DataGridServer = ({
  idProperty = "autoId",
  columns,
  defaultLimit,
  checkboxColumn,
  useFilter,
  useMutation,
  configMutation,
  params,
  onFetching,
  onRowSelected,
  onCheckboxSelected,
  autoColumns,
  columnsAlias,
  filterColumnsByAlias,
  onDataChange,
  localFilter,
  allowRefetch,
  rowHeight,
  onReady,
  disableFilterList,
  defaultSelected,
  autoSummary,
  reducerGrid = "DataGrid",
  rowClassName,
  contextMenu,
  autoHeader,
  rememberFilterOnRefetch
}: ReactDataGridType) => {
  const dispatch = useDispatch()
  const { propsGrid } = useSelector((state: any) => state.dataGrid)

  let fetchingStatus = { isFetching: true, isSuccess: false, isError: false }
  let totalFetch: number = 0
  let currentDGParams: any = {}
  let tempData: any = {}

  const [enableFiltering, setEnableFiltering]: any = useState(useFilter ?? false)
  const [sort, setSort]: any = useState({})
  const [newColumns, setNewColumns]: any[] = useState([])
  const [initParams, setInitParams] = useState({})
  const [currentFilter, setCurrentFilter]: any = useState([])
  const [fetchBaseQuery, { isLoading }] = useMutation()
  const [isRefetching, setIsRefetching] = useState(false)
  const [isReadyData, setIsReadyData]: any = useState(false)
  const [curData, setCurData] = useState([])

  const emptyData: any = async (props: any) => {
    fetchingStatus.isFetching = false
    if (onFetching) onFetching(fetchingStatus)
    return []
  }

  useEffect(() => {
    if (!_.isEqual(initParams, params) || allowRefetch) {
      setInitParams(params)
      hardResetAllFunction()
    }
  }, [params])

  useEffect(() => {
    if ((newColumns?.length || columns?.length) && !currentFilter?.length) {
      const defaultFilterValue: any[] = useFilter ? _.map(autoColumns ? newColumns : columns, idx => {
        return {
          name: idx?.name,
          type: !idx?.type ? "date" : idx?.type,
          operator: !idx?.type ? 'inrange' : idx?.type === "number" ? 'eq' : 'contains',
          value: (idx?.type === "number") || (!idx?.type) ? undefined : '',
          active: !_.some(disableFilterList, ix => ix === idx?.name)
        }
      }) : []
      setCurrentFilter(defaultFilterValue)
    }
  }, [columns, newColumns])

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
      || ((idx.itemId === "customFilter") && useFilter)
      // || idx === "-"
    )
  }, [enableFiltering])

  const [selected, setSelected] = useState({})

  const handleRowSelected = (val: any) => {
    if (onRowSelected) onRowSelected(val?.data)
    if (!checkboxColumn) setSelected({ [val.data[idProperty]]: true })
  }

  const handleCheckboxSelected = (val: any) => {
    let newSelected: any = {}
    if (_.isObject(val?.selected)) {
      newSelected.selected = Object.values(val?.selected)
    }
    else if (val?.unselected) {
      const newDataUnselected = Object.keys(val?.unselected)
      newSelected.selected = _.reject(val?.originalData, idx => _.some(newDataUnselected, ix => idx[idProperty] === ix))
      newSelected.unselected = _.filter(val?.originalData, idx => _.some(newDataUnselected, ix => idx[idProperty] === ix))
    }
    else if (val?.selected === true) {
      // newSelected.selected = val?.data
      newSelected.selected = val?.originalData
      newSelected.isSelectedAll = true
    }
    if (onCheckboxSelected) onCheckboxSelected(newSelected)
    setSelected(val?.selected)
  }

  const loadData = async (dataGridParams: any, initParams: any) => {
    const { limit, skip, sortInfo, filterValue, currentData } = dataGridParams
    const newDgParams = Object.assign({}, { filterValue }, { sortInfo: sortInfo ? sortInfo : {} })
    const isFilterChange = !_.isEqual(currentDGParams?.filterValue, filterValue) && currentDGParams?.filterValue
    const isSortChange = !_.isEqual(currentDGParams?.sortInfo, sortInfo) && currentDGParams?.sortInfo

    if (totalFetch === 1) { // LOGIC FOR PREVENT DOUBLE FETCH AT FIRST TIME WHEN FILTER AND COLUMNS STILL EMPTY AND GET CHANGE
      totalFetch++
      currentDGParams = newDgParams
      // return currentData
      return tempData
    }
    else if (localFilter && (isSortChange || isFilterChange)) { // LOGIC FOR LOCAL FILTERING & SORTING
      currentDGParams = newDgParams
      const filterData = filterFunction(tempData?.data, filterValue)
      const newData = _.isEmpty(sortInfo) ? filterData : sortFunction(filterData, sortInfo)
      return newData
    }
    else if (_.isEqual(initParams, params)) { // LOGIC FOR FETHING API
      const filter: any[] = autoRemapFilter(filterValue)
      const newParams: any = Object.assign({}, initParams, {
        limit,
        sortType: sortInfo?.columnName ?? '',
        sortBy: sortInfo?.dir === 1 ? "asc" : sortInfo?.dir === -1 ? "desc" : '',
        page: (skip / limit) + 1,
        filter
      })
      currentDGParams = newDgParams
      const newData = await fetchApiData(newParams, !filterValue)
      tempData = Object.assign({}, newData)
      setCurData(tempData?.data)
      setIsReadyData(true)
      // return newData
      if (localFilter && filterValue) {
        return filterFunction(newData?.data, filterValue)
      } else {
        return newData
      }
    }
    return currentData
  }

  const fetchApiData = (newParams: any, isInitFetch: boolean) => {
    if (onFetching) onFetching(fetchingStatus)
    return fetchBaseQuery(newParams)
      .unwrap()
      .then((res: any) => {
        fetchingStatus.isSuccess = true
        const tempColumns = getGlobalColumns(res?.columns, { autoSummary, colsAlias: columnsAlias, filterColumnsByAlias, isAutoHeader: autoHeader })
        if (autoColumns && !_.isEqual(newColumns, tempColumns)) setNewColumns(tempColumns)
        const currentCounter = (res?.meta?.page - 1) * res?.meta?.take
        const newData = {
          // data: res?.data,
          data: idProperty === "autoId"
            ? _.map(res?.data, (ix, key) => ({ ...ix, [idProperty]: currentCounter + (key + 1) }))
            : res?.data,
          count: res?.meta?.itemCount
        }
        return newData ?? defaultData
      })
      .catch((err: any) => {
        fetchingStatus.isError = true
        return defaultData
      })
      .finally(() => {
        setSelected({})
        if (onRowSelected) onRowSelected({})
        if (onFetching) onFetching({ ...fetchingStatus, isFetching: false })
        if (onDataChange && !isInitFetch) onDataChange()
        if (isInitFetch) totalFetch++
        if (isRefetching) setIsRefetching(false)
      })
  }

  const hardResetAllFunction = () => {
    totalFetch = 0
    currentDGParams = {}
    tempData = {}
    setCurrentFilter(null)
    setSort(null)
  }

  const [gridRef, setGridRef]: any = useState({})

  useEffect(() => {
    if (onReady) {
      onReady(gridRef)
    }
  }, [isReadyData])

  useEffect(() => {
    if (defaultSelected?.length) {
      gridRef?.current?.setSelected(_.reduce(_.filter(defaultSelected, idx => _.some(curData, ix => ix[idProperty] === idx)), (obj, item) =>
        Object.assign(obj, { [item]: _.find(curData, idx => idx[idProperty] === item) }), {}))
    }
  }, [isReadyData])

  const renderColumnFilterContextMenu: any = useCallback((menuProps: any, { cellProps }) => {
    if (_.some(disableFilterList, idx => idx === cellProps?.name)) {
      menuProps.items = _.filter(menuProps.items, idx => (idx?.value === menuProps?.selected?.operator))
    } else if (disableFilterList?.length) {
      menuProps.items = _.reject(menuProps.items, idx => idx?.itemId?.includes("clear"))
    }
  }, [])

  const onKeyDown = (e: any, data: any[], selected: any) => {
    let findIndex: number = _.findIndex(data, Object.values(selected)[0] ?? {})
    // console.log("test", findIndex, selected)
    if (e.code === "ArrowDown") findIndex = !findIndex && _.isEmpty(selected) ? 0 : findIndex + 1
    else if (e.code === "ArrowUp") findIndex = findIndex - 1
    const selectedData = data[findIndex]
    handleCheckboxSelected({ selected: { [selectedData[idProperty]]: selectedData } })
    if (onRowSelected && selectedData) onRowSelected(selectedData)
  }

  useEffect(() => {
    if (propsGrid?.[reducerGrid]?.isReload) {
      setInitParams({ ...params })
      if (!rememberFilterOnRefetch) hardResetAllFunction()
      dispatch(resetReloadGrid(reducerGrid))
    }
  }, [propsGrid?.[reducerGrid]?.isReload])

  const renderRowContextMenu = (menuProps?: any, props?: any) => {
    const { rowProps, cellProps, computedProps, computedPropsRef } = props
    const isMultiSelected = (!_.isEmpty(selected) || (selected === true)) && checkboxColumn
    // const newSelected = selected === true ? _.reject(rowProps?.data, idx => _.some(Object.keys(unSelected ?? {}) ?? [], ix => Number(ix) === idx?.[idProperty ?? "id"])) : Object.values(selected)
    const cleanData = idProperty === "autoId" ? _.omit(cellProps?.data, ["autoId"]) : cellProps?.data
    const newSelected = selected === true ? _.reject(cleanData, idx => _.some(Object.keys({}) ?? [], ix => Number(ix) === idx?.[idProperty ?? "id"])) : Object.values(selected)
    const jsonValue = isMultiSelected ? newSelected : cleanData
    let sortedA = {};
    rowProps?.columns.forEach((item :any) => {
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
    const defaultContextMenu: any = [

      {
        label: `Copy (Text) : ${cellProps?.value}`,
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
    const extendContextMenu = _.map(contextMenu, idx => ({ ...idx, onClick: () => idx?.onClick({ rowData: cellProps?.data }) }))
    menuProps.items = defaultContextMenu.concat(extendContextMenu)
  }

  return (
    <ReactDataGrid
      activeIndex={_.isEmpty(selected) ? -1 : undefined}
      idProperty={idProperty ?? "id"}
      style={gridStyle}
      columns={autoColumns ? newColumns : columns ?? []}
      pagination
      livePagination
      dataSource={useCallback((e: any) => configMutation?.skip ? emptyData() : loadData(e, initParams), [initParams, isRefetching, autoSummary, columnsAlias, idProperty, autoHeader])}
      // filterRowHeight={30}
      // headerHeight={autoSummary ? 50 : 35}
      // rowHeight={rowHeight ?? 23}
      defaultLimit={defaultLimit ?? 50}
      checkboxOnlyRowSelect={checkboxColumn}
      checkboxColumn={checkboxColumn}
      selected={selected}
      enableSelection
      // defaultFilterValue={defaultFilterValue}
      filterValue={currentFilter}
      onFilterValueChange={(e: any) => setCurrentFilter(e)}
      enableFiltering={onReady ? enableFiltering : enableFiltering && (currentFilter?.length > 0)}
      renderColumnContextMenu={renderColumnContextMenu}
      renderColumnFilterContextMenu={renderColumnFilterContextMenu}
      onRowClick={(e: any) => handleRowSelected(e)}
      onSelectionChange={(val: any) => handleCheckboxSelected(val)}
      sortInfo={sort}
      onSortInfoChange={setSort}
      onReady={setGridRef}
      onKeyDown={(e) => onKeyDown(e, curData, selected)}
      rowClassName={rowClassName}
      renderRowContextMenu={renderRowContextMenu}
    />
  );
};

export default DataGridServer;