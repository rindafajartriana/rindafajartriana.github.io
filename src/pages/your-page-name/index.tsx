import { useDispatch } from "react-redux"
import DataGrid from "../../components/organisms/dataGrid"
import Button from "../../components/atoms/button"
import { setAlert } from "../../store/redux-collection/alert"
import Select from "../../components/atoms/select"
import { getGlobalColumns } from "@helpers/globalColumns"
import { columnsAlias, columnsDummy, dataDummy } from "@pages/your-page-name/_dummy"
import _ from "lodash"
import { clearPopup, setPopup } from "@store/redux-collection/popup"
import DataGridServer from "@components/organisms/dataGridServer"
import { useGetDummyDataMutation } from "@store/redux-collection/dummy"
import SelectDataServer from "@components/organisms/selectDataServer"


const YourPageName = () => { //#changeThis test
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setPopup({
      type: "success",
      title: "Berhasil",
      stack: false,
      content: () => "Simple Message",
      onEnter: (i) => dispatch(clearPopup(i))
    }))
  }

  return (
    <div className="card-main h-full flex-[3] space-y-2">
      <div className="wrapper-main">
        <h2 className="uppercase font-semibold">Your Page Name</h2>
        <hr />
        <div className="flex justify-between gap-2">

          <div className="flex gap-2">
            <Button
              className="btn color-secondary w-fit"
              onClick={() => dispatch(setPopup({
                title: "Popup",
                // type: "warning",
                content: "Example Alert Message. Press ESC to close"
              }))}
            >
              Popup Message
            </Button>
            <Button
              className="btn color-primary w-fit"
              onClick={() => dispatch(setPopup({
                type: "warning",
                title: "Peringatan",
                content: "Apakah anda yakin?",
                confirm: {
                  onClick: () => handleClick()
                },
                onEnter: () => handleClick()
              }))}
            >
              Validation Message
            </Button>
          </div>
          <div className="w-fit">
            <Select
              options={[
                { label: "user", value: "1" },
                { label: "admin", value: "2" }
              ]}
              onSelect={(e) => console.log(e)}
            />
          </div>
          <div className="w-fit">
            <SelectDataServer
              useMutation={useGetDummyDataMutation}
              optionsObj={(v) => ({ label: v?.name, value: v?.id })}
              params={{}}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 h-full">
          <div className="flex h-full">
            <DataGrid
              idProperty="id"
              columns={getGlobalColumns(columnsDummy, {
                "colsAlias": columnsAlias,
                // "autoSummary": true
              })}
              data={dataDummy}
              useFilter
              checkboxColumn
            />
          </div>
          <div className="h-full">
            <DataGridServer
              reducerGrid="list"
              idProperty="id"
              useMutation={useGetDummyDataMutation}
              columnsAlias={[]}
              params={{}}
              autoColumns
              useFilter
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourPageName //#changeThis