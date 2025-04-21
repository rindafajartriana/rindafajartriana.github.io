import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "dummyAPI"

export const dummyAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    getDummyData: build.mutation<any, any>({
      query: (params: any) => {
        return {
          url: `/dummy`,
          params
        }
      },
    }),
    postDummy: build.mutation<any, any>({
      query: (args: any) => {
        const { params, body } = args
        return {
          url: `/dummy/simpan`,
          method: "POST",
          params,
          body
        }
      }
    })
  }),
})

export const { useGetDummyDataMutation, usePostDummyMutation } = dummyAPI
export const dummyQueryReducer = {
  [reducerPath]: dummyAPI.reducer,
}