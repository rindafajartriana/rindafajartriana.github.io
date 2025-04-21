import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "pesanAPI"

export const pesanAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  tagTypes: ["listPesan"],
  endpoints: (build) => ({
    getListPesan: build.query<any, any>({
      query: ({ params, type }) => {
        return {
          url: `/message/${type}`,
          params
        }
      },
      providesTags: ["listPesan"]
    }),
    getListNotif: build.query<any, any>({
      query: ({ params, type }) => {
        return {
          url: `/notifikasi${type ? "/" + type : ""}`,
          params
        }
      },
    }),
    getListNotifAll: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/notifikasi`,
          params
        }
      },
    }),
    postPesan: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/message`,
          method: "POST",
          body
        }
      }
    }),
    postReadPesan: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/message/read`,
          method: "POST",
          body
        }
      }
    }),
    postNotif: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/notifikasi`,
          method: "POST",
          body
        }
      }
    }),
  }),
})

export const { useGetListPesanQuery, usePostPesanMutation, useGetListNotifQuery, usePostNotifMutation, usePostReadPesanMutation, useGetListNotifAllQuery } = pesanAPI
export const pesanQueryReducer = {
  [reducerPath]: pesanAPI.reducer,
}