
import Button from "@components/atoms/button"
import Spinner from "@components/atoms/spinner"
import FormStrukturOrganisasi from "@pages/struktur-organisasi/_form"
import FormStrukturAnggota from "@pages/struktur-organisasi/_formAnggota"
import { useGetListStrukturQuery } from "@store/redux-collection/dokumen"
import { setPopup } from "@store/redux-collection/popup"
import { AnyObj } from "@type"
import _ from "lodash"
import { useRef } from "react"
import { Tree, TreeNode } from "react-organizational-chart"
import { useDispatch } from "react-redux"
import { useScreenshot, createFileName } from 'use-react-screenshot'

const Label = ({ dataLabel, nodeKey }: { dataLabel: AnyObj, nodeKey?: boolean }) => {
  return (
    <div className={`relative my-2 flex flex-col gap-2 ${nodeKey ? "border-t pt-1" : ""}`}>
      <div className="">
        <p className="font-bold">{dataLabel?.name}</p>
        {
          _.map(dataLabel?.anggota, (x, k) => (
            <div key={k} className="flex flex-col justify-center items-center">
              <p className="text-gray-500  mx-2 whitespace-nowrap" key={k}>{x?.fullname}</p>
              {x?.dept && <p className="text-slate-400 text-sm whitespace-nowrap" key={k}>({x?.dept})</p>}
            </div>
          ))
        }
      </div>
      {
        _.map(dataLabel?.childNode, (x, k) => (
          <Label dataLabel={x} key={k} nodeKey={true} />
        ))
      }
    </div>
  )
}

const LabelArea = ({
  data,
  onClose,
  accessType
}) => {
  const dispatch = useDispatch()
  const onManageAnggota = ({ data }) => {
    dispatch(setPopup({
      title: "Manage Anggota",
      containerClass: "md:w-[30rem]",
      id: "formTambah",
      content: () => <FormStrukturAnggota data={data} onReload={() => onClose()} />,
      onClose: () => onClose(),
      noButton: true
    }))
  }

  return data?.name.includes?.("#extend") ? (
    <div className="">
    </div>
  ) : (
    <div className={` border px-4 rounded-lg inline-block w-[18rem] ${data?.name?.includes('Koordinator') ? `min-h-[29rem] max-h-[29rem]` : ''} overflow-y-auto  bg-white hover:border-green-700 cursor-pointer`}
      onClick={() => accessType?.create && onManageAnggota({ data })}
    >
      <Label dataLabel={data} />
    </div>
  )
}

const TreeNodeComp = ({ orgData, onClose, accessType }) => {
  return (
    <TreeNode label={<LabelArea accessType={accessType} data={orgData} onClose={onClose} />}>
      {
        _.map(orgData?.child, (x, k) => (
          <TreeNodeComp orgData={x} key={k} onClose={onClose} accessType={accessType} />
        ))
      }
    </TreeNode>
  )
}

const StrukturOrganisasi = ({ accessType }) => {
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0
  })

  const { data, refetch, isFetching } = useGetListStrukturQuery({}, { refetchOnMountOrArgChange: true })

  const onTambah = () => {
    dispatch(setPopup({
      title: "Tambah Organisasi",
      containerClass: "md:w-[30rem]",
      id: "formTambah",
      content: () => <FormStrukturOrganisasi onSuccess={() => refetch()} />,
      noButton: true
    }))
  }

  const download = (image: any, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const onDownload = () => {
    takeScreenshot(ref.current).then(download)
  }

  return (
    <div className="relative flex flex-col w-full mx-4 mb-2">
      <div className="flex gap-3 justify-between">
        {
          accessType?.create &&
          <Button className="btn color-primary my-2 w-fit"
            onClick={() => onTambah()}
          >Tambah Organisasi</Button>
        }
        <Button className="btn color-primary my-2 w-fit"
          onClick={() => onDownload()}
        >Unduh</Button>
      </div>
      {
        isFetching &&
        <div className="absolute z-10 w-full h-full flex flex-col gap-3 justify-center items-center">
          <Spinner className="w-10 h-10" />
          <p>Memuat data...</p>
        </div>
      }
      <div className="relative main-container-transparent overflow-x-scroll h-full max-w-full border border-black rounded ">
        <div className="absolute py-10 px-5" ref={ref}>
          {
            _.map(data?.data, (x, k) => (
              <Tree
                key={k}
                lineWidth={'0.5px'}
                lineHeight="100px"
                lineColor={'green'}
                lineBorderRadius={'10px'}
                label={<LabelArea data={x} key={k} accessType={accessType} onClose={() => refetch()} />}
              >
                {
                  _.map(x?.child, (xx, kk) => (
                    <TreeNodeComp orgData={xx} key={kk} accessType={accessType} onClose={() => refetch()} />
                  ))
                }
              </Tree>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default StrukturOrganisasi