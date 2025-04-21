import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "dokumentAPI"

export const dokumentAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    getListStruktur: build.query<any, any>({
      query: ({ params }) => {
        return {
          url: `/master/struktur`,
          params
        }
      }
    }),
    postStruktur: build.mutation<any, any>({
      query: (args) => {
        const { id, body } = args
        return {
          url: `/master/struktur${id ? "/" + id : ""}`,
          method: id && body ? "PUT" : body ? "POST" : "DELETE",
          body
        }
      }
    }),
    postStrukturAnggota: build.mutation<any, any>({
      query: (args) => {
        const { id, body, role_id } = args
        return {
          url: `/master/struktur/${id ? id + "/anggota/" + role_id : "anggota"}`,
          method: id ? "DELETE" : "POST",
          body
        }
      }
    }),
  }),
})

export const { useGetListStrukturQuery, usePostStrukturAnggotaMutation, usePostStrukturMutation } = dokumentAPI
export const dokumentQueryReducer = {
  [reducerPath]: dokumentAPI.reducer,
}