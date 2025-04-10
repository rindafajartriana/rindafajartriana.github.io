import Select2 from '@components/atoms/select2'
import { setPopup } from '@store/redux-collection/popup'
import { Options, PaginationType } from '@type'
import _ from 'lodash'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

type AnyObj = {
  [item: string]: any
}

interface SelectDataServer {
  loadDataOnRender?: boolean
  useMutation: any
  value?: string
  params?: any
  optionsObj: (v: any) => Options
  optionsInit?: Options[]
  onSelect?: (v: Options, obj?: AnyObj, isClick?: boolean) => void
  disabled?: boolean
  placeholder?: string
  onClear?: (onClick?: boolean) => void
}

const SelectDataServer = ({
  loadDataOnRender,
  params,
  useMutation,
  optionsObj,
  optionsInit = [],
  value,
  onSelect,
  disabled,
  placeholder,
  onClear
}: SelectDataServer) => {
  const dispatch = useDispatch()
  const [isBeginFetchData, setIsBeginFetchData] = useState(false)
  const [isLoadingType, setIsLoadingtype] = useState(false)
  const [fetchApi, { isLoading }] = useMutation()
  const [pagination, setPagination] = useState<PaginationType>({ limit: 20, page: 1 })
  const [metaData, setMetaData] = useState<AnyObj>({})
  const [data, setData] = useState<Options[]>([])
  const [originData, setOriginData] = useState<AnyObj[]>([])
  const [newParams, setNewParams] = useState<AnyObj>({})
  const [keys, setKeys] = useState("")

  useEffect(() => {
    if (!_.isEqual(params, _.omit(newParams, ["keyword", "page", "limit"]))) {
      setNewParams({ ...params, ...pagination })
      if (loadDataOnRender) {
        setKeys(moment().format())
        setIsBeginFetchData(true)
      }
    }
  }, [params])

  useEffect(() => {
    if (!_.isEmpty(newParams) && isBeginFetchData) {
      handleFetch()
    }
  }, [newParams, isBeginFetchData])

  useEffect(() => {
    if (!isBeginFetchData) {
      reset()
    }
  }, [isBeginFetchData])


  const handleFetch = () => {
    fetchApi(newParams)
      .unwrap()
      .then((res: any) => {
        setMetaData(res?.meta)
        let newData = _.map(res?.data, idx => (optionsObj(idx)))
        if (newParams?.page === 1) {
          setData(newData)
          setOriginData(res?.data)
        } else {
          setData([...data, ...newData])
          setOriginData((p) => [...p, ...res?.data])
        }
      })
      .catch((err: any) => {
        dispatch(setPopup({
          title: "Gagal",
          type: "danger",
          id: "ggalPopupFetch",
          content: () => err?.data?.meta?.message ?? "terjadi kesalahan"
        }))
      })
      .finally(() => setIsLoadingtype(false))
  }

  const handleSearch = useMemo(
    () => _.debounce((v) => {
      setNewParams(p => ({ ...p, "keyword": v, "page": 1 }))
    }, 500),
    []
  )

  const reset = () => {
    setNewParams(p => ({ ...p, "keyword": "", "page": 1 }))
  }

  return (
    <div>
      <Select2
        keys={keys}
        serverMode
        placeholder={placeholder}
        options={_.uniqBy([...optionsInit, ...data], "value")}
        // options={data}
        value={value ?? undefined}
        onSelect={(v, isClick) => onSelect && onSelect(v, _.find(originData, idx => optionsObj(idx)?.value === v?.value), isClick)}
        onClear={(isClick) => onClear && onClear(isClick)}
        onActivate={(isOpen) => !loadDataOnRender && setIsBeginFetchData(isOpen)}
        onEndOfData={() => metaData?.hasNextPage && setNewParams(p => ({ ...p, "page": newParams?.page + 1 }))}
        onSearch={(v) => {
          setIsLoadingtype(true)
          handleSearch(v)
        }}
        isLoading={isLoading || isLoadingType}
        disabled={disabled}
      />
    </div>
  )
}

export default SelectDataServer