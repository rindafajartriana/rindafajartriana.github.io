import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"
import { AnyObj } from "@type"

const reducerPath = "masterDataAPI"

export const masterDataAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  tagTypes: ["listUser"],
  endpoints: (build) => ({
    getListUser: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/user`,
          params
        }
      },
      providesTags: ["listUser"]
    }),
    fetchListUser: build.mutation<any, any>({
      query: (params: any) => {
        return {
          url: `/user`,
          params
        }
      }
    }),
    getListParentStruktur: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/master/parentStruktur`,
          params
        }
      }
    }),
    getListUserDetail: build.query<any, any>({
      query: (id: any) => {
        return {
          url: `/user/${id}`,
        }
      }
    }),
    getListArea: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/master/area`,
          params
        }
      }
    }),
    fetchQr: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/user/qrcode`,
          method: "POST"
        }
      }
    }),
    postUser: build.mutation<any, any>({
      query: (args: AnyObj) => {
        const { body, id, type } = args
        return {
          // url: `/user${id ? "/" + id : ""}`,
          url: `/user${id ? "/" + id : type === "admin" ? "/admin" : ""}`,
          body,
          method: id ? "PUT" : "POST"
        }
      }
    }),
    postUserRegister: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/user/registration`,
          body,
          method: "POST"
        }
      }
    }),
    deleteUser: build.mutation<any, any>({
      query: (body: any) => {
        return {
          url: `/user/${body?.id}`,
          // body,
          method: "DELETE"
        }
      }
    }),
    getListRole: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/master/role`,
          params
        }
      }
    }),
    postRole: build.mutation<any, any>({
      query: ({ body, id }) => {
        return {
          url: `/master/role${id ? "/" + id : ""}`,
          body,
          method: id ? "PUT" : "POST"
        }
      }
    }),
    deleteRole: build.mutation<any, any>({
      query: (id: any) => {
        return {
          url: `/master/role/${id}`,
          method: "DELETE"
        }
      }
    }),
    getListDepartment: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/master/department`,
          params
        }
      }
    }),
    postDepartment: build.mutation<any, any>({
      query: ({ body, id }) => {
        return {
          url: `/master/department${id ? "/" + id : ""}`,
          body,
          method: id ? "PUT" : "POST"
        }
      }
    }),
    deleteDepartment: build.mutation<any, any>({
      query: (id: any) => {
        return {
          url: `/master/department/${id}`,
          method: "DELETE"
        }
      }
    }),
    getListJabatan: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/master/jabatan`,
          params
        }
      }
    }),
    postJabatan: build.mutation<any, any>({
      query: ({ body, id }) => {
        return {
          url: `/master/jabatan${id ? "/" + id : ""}`,
          body,
          method: id ? "PUT" : "POST"
        }
      }
    }),
    deleteJabatan: build.mutation<any, any>({
      query: (id: any) => {
        return {
          url: `/master/jabatan/${id}`,
          method: "DELETE"
        }
      }
    }),
    actionUser: build.query<any, any>({
      query: (params: any) => {
        return {
          url: `/basic-menu`,
          params
        }
      }
    }),
    postUploadPhoto: build.mutation<any, any>({
      query: (body) => {
        return {
          url: `/user/upload`,
          method: "POST",
          // headers: {
          //   'Access-Control-Allow-Origin': '*'
          // },
          body
        }
      },
    }),
    postArea: build.mutation<any, any>({
      query: ({ body, id }) => {
        return {
          url: `/master/area${id ? "/" + id : ""}`,
          body,
          method: body && id ? "PUT" : id ? "DELETE" : "POST"
        }
      }
    }),
    deleteArea: build.mutation<any, any>({
      query: (id: any) => {
        return {
          url: `/master/area/${id}`,
          method: "DELETE"
        }
      }
    }),
  }),
})

export const {
  useGetListUserQuery,
  useGetListDepartmentQuery,
  useGetListRoleQuery,
  useGetListJabatanQuery,
  usePostUserMutation,
  usePostDepartmentMutation,
  usePostJabatanMutation,
  usePostRoleMutation,
  useDeleteUserMutation,
  useDeleteDepartmentMutation,
  useDeleteJabatanMutation,
  useDeleteRoleMutation,
  usePostUserRegisterMutation,
  usePostUploadPhotoMutation,
  useGetListUserDetailQuery,
  useFetchListUserMutation,
  useGetListParentStrukturQuery,
  useFetchQrMutation,
  useGetListAreaQuery,
  usePostAreaMutation,
  useDeleteAreaMutation
} = masterDataAPI
export const masterDataQueryReducer = {
  [reducerPath]: masterDataAPI.reducer,
}