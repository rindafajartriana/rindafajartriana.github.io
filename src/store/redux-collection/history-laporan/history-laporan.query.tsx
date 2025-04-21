import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "historyLaporanAPI"

export const historyLaporanAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    fetchListHistoryLaporan: build.mutation<any, any>({
      query: (params) => {
        return {
          url: `/tps`,
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
          columns: res?.columns?.map((column) => ({
            ...column,
            fieldName: column.fieldName === 'id' ? 'no' : column.fieldName 
          }))
        };
      }     
    }),
    getListHistoryLaporan: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/tps`,
          params
        }
      }
    }),
    getListSoal: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/training/soal`,
          params
        }
      }
    }),
    getListHistoryTraining: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/training/history`,
          params
        }
      }
    }),
    getListDashboard: build.query<any, any>({
      query: ({ params, type }) => {
        return {
          url: `/dashboard/${type}`,
          params
        }
      }
    }),
    getListSoalTraining: build.query<any, any>({
      query: (params) => {
        return {
          url: `/training/soal/start`,
          params
        }
      }
    }),
    postLaporan: build.mutation<any, any>({
      query: (args) => {
        const { id, body } = args
        return {
          url: `/tps${id ? "/" + id + "/response" : ""}`,
          method: id && body ? "PUT" : body ? "POST" : "DELETE",
          body
        }
      }
    }),
    postSoal: build.mutation<any, any>({
      query: (args) => {
        const { id, body } = args
        return {
          url: `/training/soal${id ? "/" + id : ""}`,
          method: id && body ? "PUT" : body ? "POST" : "DELETE",
          body
        }
      }
    }),
    postStartTraining: build.mutation<any, any>({
      query: () => {
        return {
          url: `/training/start`,
          method: "POST"
        }
      }
    }),
    postSubmitTraining: build.mutation<any, any>({
      query: (body) => {
        return {
          url: `/training`,
          method: "POST",
          body
        }
      }
    }),
  }),
})

export const {
  useFetchListHistoryLaporanMutation,
  useGetListSoalQuery,
  usePostLaporanMutation,
  usePostSoalMutation,
  useGetListHistoryTrainingQuery,
  useGetListSoalTrainingQuery,
  usePostStartTrainingMutation,
  usePostSubmitTrainingMutation,
  useGetListHistoryLaporanQuery,
  useGetListDashboardQuery
} = historyLaporanAPI
export const historyLaporanQueryReducer = {
  [reducerPath]: historyLaporanAPI.reducer,
}