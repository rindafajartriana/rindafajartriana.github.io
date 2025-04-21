import Input from "@components/atoms/input"
import Select from "@components/atoms/select"
import TextArea from "@components/atoms/textarea"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"

export type MasterType = "text" | "number" | "select" | "checkbox" | "radio" | "textarea"
export type MasterValueType = string | boolean | any[] | number | null | undefined
export type FormType = {
  [key: string]: MasterValueType
}

type ValidationType = {
  isRequired?: boolean,
  invalid?: (val: MasterValueType) => boolean
  errorMessage?: string
}

export type fieldGroupType = {
  name: string
  label?: string
  placeholder?: string
  type: MasterType
  value?: MasterValueType
  defaultValue?: MasterValueType
  validation?: ValidationType
}

type ExtraProps = {
  isValid: boolean,
  setIsCheckValidate: (val: boolean) => void
}

interface GlobalFormV2Type {
  orientation?: "split" | undefined
  fieldGroup: fieldGroupType[]
  onSubmit?: (val: FormType, props: ExtraProps) => any
  onVoid?: () => any
  onForm?: (val: FormType) => void
  onSubmitByEnter?: (val: FormType, props: ExtraProps) => any
}

type onChangeType = (name: string, value: MasterValueType, type: MasterType) => void
type onKeyDownType = (e: any) => void

interface MultiFormType {
  onChange: onChangeType
  invalid?: boolean
  onKeyDown?: onKeyDownType
}


const invalidValue = (isCheckValidate: boolean, idx: fieldGroupType, form: FormType) => {
  const invalidForm = idx?.validation?.invalid && idx?.validation?.invalid(form[idx.name]) ? true : false
  const isRequiredForm = idx?.validation?.isRequired && !form[idx.name] ? true : false
  return isCheckValidate && (invalidForm || isRequiredForm) ? true : false
}

const invalidForm = (fieldGroup: fieldGroupType[], form: FormType) => {
  return !_.some(fieldGroup, idx =>
    (idx?.validation?.invalid && idx?.validation?.invalid(form[idx.name]))
    || (idx?.validation?.isRequired && !form[idx.name])
  )
}

const getField = (value: string) => {
  return document.querySelector(`input[name='${value}'][id='${value}']`)
}

const MultiForm = ({
  type,
  value,
  name,
  placeholder,
  onChange,
  onKeyDown,
  invalid
}: fieldGroupType & MultiFormType) => {
  switch (type) {
    case "text":
      return <Input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        name={name}
        id={name}
        onBlur={() => onChange(name, typeof value === "string" ? value?.trim() : value, type)}
        onChange={(e) => onChange(e.target.name, e.target.value, type)}
        invalid={invalid}
        onKeyDown={onKeyDown}
      />
    case "number":
      return <Input
        type={type}
        value={value ?? NaN}
        placeholder={placeholder}
        name={name}
        id={name}
        // onBlur={() => onChange(name, value, type)}
        onChange={(e) => onChange(e.target.name, e.target.valueAsNumber, type)}
        invalid={invalid}
        onKeyDown={onKeyDown}
      />
    case "textarea":
      return <TextArea
        value={value ?? ""}
        name={name}
        id={name}
        onChange={(e) => onChange(e.target.name, e.target.value, type)}
        invalid={invalid}
        onKeyDown={onKeyDown}
      />
    case "select":
      return <Select />
    default:
      return <Input />
  }
}

const GlobalFormV2 = ({
  orientation,
  fieldGroup,
  onSubmit,
  onVoid,
  onForm,
  onSubmitByEnter
}: GlobalFormV2Type) => {
  const ref: any = useRef()
  const [form, setForm] = useState<FormType>({})
  const [isCheckValidate, setIsCheckValidate] = useState(false)

  useEffect(() => {
    // const mapFieldForm = _.mapValues(_.keyBy(fieldGroup, 'name'), 'value')
    const mapFieldForm = _.reduce(
      fieldGroup,
      // (acc, { name, value }) => ({ ...acc, [name]: value ?? "" }),
      (acc, { name, defaultValue, type }) => ({
        ...acc,
        [name]: !form[name] ?
          type === "number" ?
            defaultValue ?
              Number(defaultValue) : NaN
            : defaultValue ?? ""
          : form[name]
      }),
      {}
    )

    setForm(p => ({
      ...p,
      ...mapFieldForm
    }))
  }, [fieldGroup])

  useEffect(() => {
    if (onForm) {
      onForm(form)
    }
  }, [form])

  useEffect(() => {
    if (ref?.current) {
      const currentField = ref?.current?.children[0]
      currentField.focus()
    }
  }, [ref?.current, fieldGroup])


  const onKeyDown: onKeyDownType = (e) => {
    if (onVoid) onVoid()
    if (e?.key === "Enter" && !e?.shiftKey) {
      e.preventDefault()
      const curIndex = _.findIndex(fieldGroup, { name: e.target.name }) + 1
      let typeForm: string
      switch (fieldGroup?.[curIndex]?.type) {
        case "textarea":
          typeForm = "textarea"
          break
        default:
          typeForm = "input"
          break
      }
      // console.log(curIndex, fieldGroup?.length)
      if ((fieldGroup?.length === curIndex) && onSubmitByEnter) {
        onSubmitByEnter(form, {
          isValid: invalidForm(fieldGroup, form),
          setIsCheckValidate
        })
        // if (document.activeElement) document.activeElement.blur()
      } else {
        const nextField: any = document.querySelector(`${typeForm}[name='${fieldGroup?.[curIndex]?.name}'][id='${fieldGroup?.[curIndex]?.name}']`)
        nextField.focus()
      }
    }
  }

  const onChange: onChangeType = (name, value, type) => {
    let newValue = value
    setForm(p => ({
      ...p,
      [name]: newValue
    }))
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col gap-3">
        {
          _.map(fieldGroup, (idx, key) => (
            <div key={key} className={`flex ${orientation === "split" ? "flex-row space-x-2 items-start" : "flex-col"}`}>
              <label className={`leading-4 text-sm ${orientation === "split" ? "flex-[3]" : ""}`}>
                {idx?.label}{idx?.validation?.isRequired ? <span className="text-red-600 font-semibold">*</span> : undefined}
              </label>
              <div ref={key === 0 ? ref : undefined} className={`${orientation === "split" ? "flex-[5]" : ""}`}>
                <MultiForm
                  {...idx}
                  value={form?.[idx?.name]}
                  onChange={onChange}
                  invalid={invalidValue(isCheckValidate, idx, form)}
                  onKeyDown={(e) => onKeyDown(e)}
                />
                {
                  // (isCheckValidate) &&
                  // (
                  //   (idx?.validation?.invalid && idx?.validation?.invalid(form[idx.name]))
                  //   || (idx?.validation?.isRequired && !form[idx.name])
                  // ) &&
                  invalidValue(isCheckValidate, idx, form) &&
                  <h2 className="text-xs text-red-600 bg-red px-1">
                    {idx?.validation?.isRequired && !form[idx.name] ? "Harus diisi. " : ""}
                    {idx?.validation?.invalid && idx?.validation?.invalid(form[idx.name]) ? idx?.validation?.errorMessage : ""}
                  </h2>
                }
              </div>
            </div>
          ))
        }
      </div>
      <div className="flex gap-2 justify-center">
        {onSubmit && onSubmit(form, {
          isValid: invalidForm(fieldGroup, form),
          setIsCheckValidate
        })}
        {onVoid && onVoid()}
      </div>
    </div>
  )
}

export default GlobalFormV2