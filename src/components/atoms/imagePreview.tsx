import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IRootState } from "@store/redux-collection";
import Img from "@components/atoms/img";
import { CloseIcon } from "@assets/icons/_index";
import _ from "lodash";
import { clearPreviewImage } from "@store/redux-collection/popup";

const ImagePreview = () => {
  const dispatch = useDispatch()
  const { imgPreview, defaultImgPreview } = useSelector((state: IRootState) => state.popup)
  const [selectedImage, setSelectedImage] = useState<{ path?: string, label?: string }>({})

  useEffect(() => {
    setSelectedImage(defaultImgPreview ? _.find(imgPreview, { path: defaultImgPreview }) ?? {} : imgPreview?.[0])
    return () => {
      setSelectedImage({})
    }
  }, [JSON.stringify(imgPreview ?? [])])


  return imgPreview?.length ? (
    <div className="fixed overflow-hidden flex flex-col gap-4 justify-center items-center inset-0 bg-opacity-70 backdrop-blur z-[999] bg-black w-screen h-screen p-10">
      <CloseIcon className="fixed text-red-600 inset-0 top-0 left-[calc(100%-74px)] w-11 h-11 bg-red-100 rounded m-4 cursor-pointer"
        onClick={() => dispatch(clearPreviewImage())}
      />
      <div className="flex flex-col h-full w-full items-center overflow-hidden">
        <div className="flex flex-col h-full w-fit">
          {
            selectedImage?.path ?
              <Img src={selectedImage?.path} className="max-h-full max-w-full" />
              :
              <div className="text-white text-center">
                <p>No Image Found</p>
                <p className="text-sm">{selectedImage?.path}</p>
              </div>
          }
        </div>
      </div>
      <label className="text-white text-center text-lg min-h-[2rem] max-h-[2rem]">{selectedImage?.label}</label>
      {
        imgPreview?.length ?
          <div className="bg-slate-950 bg-opacity-80 flex gap-2 overflow-x-auto overflow-y-hidden min-h-[6rem] max-h-[6rem] w-fit rounded-sm p-2 justify-left"
            style={{ scrollbarWidth: "thin" }}
          >
            {
              _.map(imgPreview, (x, k) => (
                <Img key={k} src={x?.path} onClick={() => setSelectedImage(x)} className={`p-1 min-w-[4rem] ${x?.path === selectedImage?.path ? "bg-blue-900" : ""}`} />
              ))
            }
          </div> : undefined
      }
    </div>
  ) : undefined
}

export default ImagePreview