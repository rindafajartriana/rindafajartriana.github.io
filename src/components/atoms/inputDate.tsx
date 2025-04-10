import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";

interface InputDate {
  id?: string
  value?: any
  name?: string
  type?: string
  onChange?: (e: { target: { name: string, value: string } }) => void
  disabled?: boolean
  nextFieldDate?: string
  style?: React.CSSProperties
}

const InputDate = ({
  id,
  value,
  name,
  type,
  onChange,
  disabled,
  nextFieldDate,
  style
}: InputDate) => {
  const newName = useMemo(() => name ?? "inputName", [name])
  const idField = useMemo(() => id ? name + id : name, [id])
  const [focus, setFocus] = useState("day");
  const [date, setDate]: any = useState({
    day: value ? moment(value).format("DD") : "",
    month: value ? moment(value).format("MM") : "",
    year: value ? moment(value).format("YYYY") : "",
  });
  const [times, setTimes]: any = useState({
    hour: value ? moment(value).format("HH") : "",
    minute: value ? moment(value).format("mm") : "",
    second: value ? moment(value).format("ss") : "",
  });
  const [inputs, setInputs]: any = useState({
    date: value ?? "",
  });

  useEffect(() => {
    if (value !== inputs?.date) {
      setDate({
        day: value ? moment(value).format("DD") : "",
        month: value ? moment(value).format("MM") : "",
        year: value ? moment(value).format("YYYY") : "",
      })
      setInputs({
        date: value,
      })
      if (type === "datetime") {
        setTimes({
          hour: value ? moment(value).format("HH") : "",
          minute: value ? moment(value).format("mm") : "",
          second: value ? moment(value).format("ss") : "",
        })
      }
    }
  }, [value])


  useEffect(() => {
    if (type === "datetime") {
      if (date?.day && date?.month && date?.year && times?.hour && times?.minute && times?.second) {
        setInputs((prevState: any) => ({
          ...prevState,
          date: date?.year + "-" + date?.month + "-" + date?.day + "T" + times?.hour + ":" + times?.minute + ":" + times?.second,
        }));
      } else {
        setInputs((prevState: any) => ({
          ...prevState,
          date: "",
        }));
      }
    } else {
      if (date?.day && date?.month && date?.year) {
        setInputs((prevState: any) => ({
          ...prevState,
          date: date?.year + "-" + date?.month + "-" + date?.day
        }));
      } else {
        setInputs((prevState: any) => ({
          ...prevState,
          date: "",
        }));
      }
    }
  }, [date, times]);

  useEffect(() => {
    if (focus === "day" || focus === "month" || focus === "year" || focus === "hour" || focus === "minute" || "second") {
      const nextFocus = focus == "day" ? "month" : focus == "month" ? "year" : focus == "year" ? "hour" : focus == "hour" ? "minute" : "second";
      const nextfield: any = document.querySelector(`input[name=${nextFocus}][id=${idField}]`)
      if (date?.[focus]?.length > 1 && focus !== 'year') {
        nextfield.focus();
      } else if (date?.[focus]?.length > 3 && type === "datetime") {
        nextfield.focus();
      } else if (times?.[focus]?.length > 1) {
        nextfield.focus();
      }
    }
  }, [date, times]);

  useEffect(() => {
    if (inputs?.date !== value) {
      onChange && onChange({
        target: {
          value: inputs?.date,
          name: newName
        }
      })
    }
  }, [inputs?.date])

  const handleFocus = (event: any) => event.target.select()

  const handleChange = (e: any) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-");
      setInputs((prevState: any) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
      setDate({
        day: day ?? "",
        month: month ?? "",
        year: year ?? "",
      });
      setTimes({
        hour: "00",
        minute: "00",
        second: "00",
      })
    } else {
      handleReset()
    }
  }

  const onChangeDate = (e: any) => {
    const val = e.target.value;
    const nam = e.target.name;
    setDate((prevState: any) => ({
      ...prevState,
      [nam]:
        val == "00"
          ? "01"
          : nam === "day" && Number(val) > 31
            ? "31"
            : nam === "month" && Number(val) > 12
              ? "12"
              : val,
    }));
    setFocus(nam);
  };

  const onChangeTime = (e: any) => {
    const val = e.target.value;
    const nam = e.target.name;
    setTimes((prevState: any) => ({
      ...prevState,
      [nam]:
        nam === "hour" && Number(val) > 24
          ? "24"
          : nam === "minute" && Number(val) > 59
            ? "00"
            : nam === "second" && Number(val) > 59
              ? "00"
              : val,
    }));
    setFocus(nam)
  };

  const handleKeydown = (e: any) => {
    const nextfield: any = document.querySelector(
      `input[name=day][id=${id ? nextFieldDate + id : nextFieldDate}]`
    )
    if (e.key === "Enter" && nextFieldDate) {
      nextfield.focus()
    }
  }

  const handleReset = () => {
    setDate({
      day: "",
      month: "",
      year: ""
    })
    setTimes({
      hour: "",
      minute: "",
      second: ""
    })
    setInputs({ date: "" })
  }

  return (
    <div style={style} className={`custom-field-date relative flex h-fit items-center border min-w-[9rem] rounded p-[0.17rem] w-full transition-all ${type === "datetime" && "hover:min-w-[14rem]"}`}>
      {disabled && <div className="bg-gray-500 bg-opacity-30 w-full absolute z-20 h-full inset-0" />}
      <div className="absolute top-0 left-0 h-full bg-white overflow-hidden rounded" style={{ width: "calc(100% - 30px)" }}>
        <div className="flex h-full px-1 space-x-[0.4rem]">
          <div className="flex h-full items-center text-sm space-x-1">
            <input
              id={idField}
              className="text-center w-[1.5rem]"
              placeholder="dd"
              name="day"
              // value={moment(inputs?.date).format("DD")}
              value={date?.day}
              onChange={(e) => onChangeDate(e)}
              onFocus={handleFocus}
              disabled={disabled}
              maxLength={2}
            />
            <div>/</div>
            <input
              id={idField}
              className="text-center w-[1.5rem]"
              placeholder="mm"
              name="month"
              // value={moment(inputs?.date).format("MM")}
              value={date?.month}
              onChange={(e) => onChangeDate(e)}
              onFocus={handleFocus}
              disabled={disabled}
              maxLength={2}
            />
            <div>/</div>
            <input
              id={idField}
              className="text-center w-[2.0rem]"
              placeholder="yyyy"
              name="year"
              // value={moment(inputs?.date).format("YYYY")}
              value={date?.year}
              onChange={(e) => onChangeDate(e)}
              onFocus={handleFocus}
              disabled={disabled}
              maxLength={4}
              onKeyDown={(e) => type === "date" && handleKeydown(e)}
            />
          </div>
          {type === "datetime" ? (
            <div className="flex w-[5rem] text-sm items-center">
              <input
                id={idField}
                className="text-center w-[1.2rem]"
                placeholder="--"
                name="hour"
                value={times?.hour}
                onChange={(e) => onChangeTime(e)}
                onFocus={handleFocus}
                disabled={disabled}
                maxLength={2}
              />
              <div className="px-[0.1rem]">:</div>
              <input
                id={idField}
                className="text-center w-[1.2rem]"
                placeholder="--"
                name="minute"
                value={times?.minute}
                onChange={(e) => onChangeTime(e)}
                onFocus={handleFocus}
                disabled={disabled}
                maxLength={2}
              />
              <div className="px-[0.1rem]">:</div>
              <input
                id={idField}
                className="text-center w-[1.2rem]"
                placeholder="--"
                name="second"
                value={times?.second}
                onChange={(e) => onChangeTime(e)}
                onFocus={handleFocus}
                disabled={disabled}
                maxLength={2}
                onKeyDown={(e) => type === "datetime" && handleKeydown(e)}
              />
            </div>
          ) : null}
        </div>
      </div>
      <input
        style={style}
        type="date"
        name="date"
        disabled={disabled}
        value={inputs?.date ? moment(inputs?.date).format("YYYY-MM-DD") : ""}
        // className={type === "date" ? "w-40" : "w-52"}
        className="w-full"
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default InputDate;
