import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "kegiatanAPI"

export const kegiatanAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    getListKegiatan: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/master/kegiatan`,
          params
        }
      },
      transformResponse: (res: any) => {
        return {
          ...res,
          data: res?.data?.map((item, index) => ({
            ...item,
            no: index + 1
          })),
          // columns: res?.columns?.map((column) => ({
          //   ...column,
          //   fieldName: column.fieldName === 'id' ? 'no' : column.fieldName 
          // }))
        };
      }  
    }),
    postKegiatan: build.mutation<any, any>({
      query: (args) => {
        const { id, body } = args
        return {
          url: `/master/kegiatan${id ? "/" + id : ""}`,
          method: id && body ? "PUT" : body ? "POST" : "DELETE",
          body
        }
      }
    }),
  }),
})

export const { useGetListKegiatanQuery, usePostKegiatanMutation } = kegiatanAPI
export const kegiatanQueryReducer = {
  [reducerPath]: kegiatanAPI.reducer,
}