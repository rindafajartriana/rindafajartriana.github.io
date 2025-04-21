import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "baseMenuAPI"

export const baseMenuAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    getBaseMenu: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/basic-menu`,
          timeout: 10000,
          params
        }
      },
      transformResponse: (response: any) => {
        const { data } = response?.meta ?? ""
        return data
      }
    }),
    getRoute: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/basic-menu/route-access`,
          timeout: 10000,
          params
        }
      },
      transformResponse: (response: any) => {
        const { data } = response?.meta ?? ""
        return data
      }
    })
  }),
})

export const { useGetBaseMenuQuery, useGetRouteQuery } = baseMenuAPI
export const baseMenuQueryReducer = {
  [reducerPath]: baseMenuAPI.reducer,
}