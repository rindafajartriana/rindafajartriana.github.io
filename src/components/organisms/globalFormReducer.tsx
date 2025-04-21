import Input from "@components/atoms/input"
import Select2 from "@components/atoms/select2"
import TextArea from "@components/atoms/textarea"
import { IRootState } from "@store/redux-collection"
import { clearCurrentDataForm, FormCollection, setDataForm } from "@store/redux-collection/data-form"
import { AnyObj } from "@type"
import _ from "lodash"
import React, { useCallback, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"

export type MasterType = "text" | "password" | "number" | "select" | "checkbox" | "radio" | "textarea" | "custom"
export type MasterValueType = string | boolean | any[] | number | null | undefined
export type FormType = {
  [key: string]: MasterValueType
}

type ValidationType = {
  isRequired?: boolean,
  invalid?: ({ value, formValue }: { value: MasterValueType, formValue?: AnyObj }) => boolean
  errorMessage?: string
}

type fieldGroupType = {
  name: string
  label?: string
  placeholder?: string
  note?: string
  disabled?: boolean | ((props?: AnyObj, { extraData }?: GlobalFormV2Type['extraData']) => boolean)
  type: MasterType
  value?: MasterValueType
  defaultValue?: MasterValueType
  validation?: ValidationType
  className?: React.HTMLProps<HTMLElement>["className"]
  labelClassName?: React.HTMLProps<HTMLElement>["className"]
  options?: ({ extraData }: { extraData: GlobalFormV2Type['extraData'] }) => ({ label: string, value: any })[]
  // onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void
  onChange?: (v: boolean, formValue?: AnyObj) => void
}

type ExtraProps = {
  isValid: boolean,
  setIsCheckValidate: (val: boolean) => void
}

const enum extraDataType {
  formBarangPO = "formBarangPO",
}

interface GlobalFormV2Type {
  orientation?: "split" | "default"
  extraData?: any
  fieldGroup: fieldGroupType[]
  onSubmit?: (val: FormType, props: ExtraProps) => any
  onSubmitByEnter?: (val: FormType, props: ExtraProps) => any
  fieldClassName?: React.HTMLProps<HTMLElement>["className"]
  formName: `${FormCollection}`
}

const MultiForm = ({
  name,
  type,
  options,
  extraData,
  formValue,
  formName,
  invalid,
  placeholder,
  disabled,
  onChange: onChangeCatch
}: fieldGroupType & {
  extraData?: GlobalFormV2Type['extraData']
  formValue?: AnyObj
  formName: GlobalFormV2Type['formName']
  invalid?: boolean
}) => {
  const dispatch = useDispatch()

  const onChange = (value: any, type?: "number" | "text") => {
    if (onChangeCatch) {
      onChangeCatch?.(value, formValue)
    } else {
      if (type === "number") {
        value = !isNaN(value) || (value === "-") ? value?.trim?.() : formValue?.[name]
      }
      if (`${value}` !== `${formValue?.[name]}`) {
        dispatch(setDataForm({
          formName,
          formValue: { ...formValue, [name]: value }
        }))
      }
    }
    // console.log("value", value)
  }

  const isDisabled = useMemo(() => {
    if (typeof disabled === 'function') return disabled?.(formValue, {extraData})
    else return disabled
  }, [formValue, extraData])

  switch (type) {
    case "number":
      return (
        <Input
          type="number-custom"
          verticalAlign="items-start"
          placeholder={placeholder}
          name={name}
          value={formValue?.[name] ?? ""}
          onChange={(e) => onChange(e.target.value, "number")}
          invalid={invalid}
          disabled={isDisabled}
        // onBlur={(e) => {
        //   dispatch(setDataForm({
        //     formName,
        //     formValue: {
        //       ...formValue,
        //       [name]: !isNaN(formValue?.[name]) && formValue?.[name] ? Number(formValue?.[name]) : null
        //     }
        //   }))
        // }}
        />
      )
    case "textarea":
      return (
        <TextArea
          placeholder={placeholder}
          name={name}
          value={formValue?.[name] ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
        // cols={999}
        />
      )
    case "select":
      return (
        <Select2
          placeholder={placeholder}
          options={options?.({ extraData })}
          value={formValue?.[name]}
          onSelect={(val) => onChange(val?.value)}
          onClear={(isClick) => isClick && onChange("")}
          invalid={invalid}
          disabled={isDisabled}
        />
      )
    case "checkbox":
      return (
        <Input
          placeholder={placeholder}
          type={type}
          verticalAlign="items-start"
          name={name}
          checked={formValue?.[name] ?? false}
          onChange={(e) => onChange(e.target.checked)}
          disabled={isDisabled}
          invalid={invalid}
        />
      )
    default:
      return (
        <Input
          placeholder={placeholder}
          type={type}
          verticalAlign="items-start"
          name={name}
          value={formValue?.[name] ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          invalid={invalid}
        />
      )
  }
}

const GlobalFormReducer = ({
  orientation,
  extraData,
  fieldGroup,
  onSubmit,
  onSubmitByEnter,
  fieldClassName,
  formName
}: GlobalFormV2Type) => {
  const dispatch = useDispatch()
  const { formValue, isValid, isCheckValidate } = useSelector((state: IRootState) => state.dataForm.form?.[formName] ?? {})

  useEffect(() => {
    if (fieldGroup?.length) {
      dispatch(setDataForm({
        formName,
        formValue: _.reduce(
          fieldGroup,
          (prev, idx) => ({
            ...prev,
            [idx?.name]: idx?.type === "number" ? null : ""
          }),
          {}
        )
      }))
    }
    return () => {
      dispatch(clearCurrentDataForm({ formName }))
    }
  }, [formName])

  useEffect(() => {
    if (formValue) {
      dispatch(setDataForm({
        formName,
        isValid: !_.some(fieldGroup, idx => idx?.validation?.invalid?.({ value: formValue?.[idx?.name], formValue: formValue }) || (!formValue?.[idx?.name] && idx?.validation?.isRequired))
      }))
    }

  }, [formValue])


  // const invalid = useMemo(() => {
  //   return _.some(fieldGroup, idx => idx?.validation?.invalid?.({ value: formValue?.[idx?.name], formValue: formValue }) || (!formValue?.[idx?.name] && idx?.validation?.isRequired))
  // }, [fieldGroup, formValue])

  const getInvalidField = useCallback(({ index, value, formValue }) => index?.validation?.invalid?.({ value, formValue }), [])

  return (
    <div className="flex flex-wrap text-sm -mx-2">
      {
        _.map(fieldGroup, (idx, key) => (
          <div key={key} className={`${(orientation === "split") || (idx?.type === "checkbox") ? "flex gap-2" : "flex flex-col"} ${idx?.className ? idx?.className : fieldClassName ?? "w-full"} p-2`}>
            <label className={`mb-1 text-gray-900 ${idx?.labelClassName ? idx?.labelClassName : orientation === "split" ? "min-w-[40%]" : ""} leading-4`}>
              {idx?.label}
              {idx?.note || idx?.validation?.isRequired ? <span className="text-red-700 ml-2">{idx?.note}{idx?.validation?.isRequired ? "* Wajib diisi" : ""}</span> : undefined}
            </label>
            <div className={`${idx?.type === "checkbox" ? "-mt-[7px] ml-1" : "w-full"}`}>
              <MultiForm {...idx}
                extraData={extraData}
                formValue={formValue}
                formName={formName}
                invalid={(isCheckValidate && (getInvalidField({ index: idx, value: formValue?.[idx?.name], formValue }) || (idx?.validation?.isRequired && !formValue?.[idx?.name])))}
              />
              {/* {
                (isCheckValidate && (getInvalidField({ index: idx, value: formValue?.[idx?.name], formValue }) || (idx?.validation?.isRequired && !formValue?.[idx?.name]))) &&
                <p className="text-xs text-red-700 leading-[.8rem] mt-[2px]">
                  {
                    [idx?.validation?.isRequired && !formValue?.[idx?.name] ? "Tidak boleh kosong"
                      : getInvalidField({ index: idx, value: formValue?.[idx?.name], formValue }) ? idx?.validation?.errorMessage ?? "Invalid value"
                        : ""]?.join?.(", ")
                  }
                </p>
              } */}
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default GlobalFormReducer