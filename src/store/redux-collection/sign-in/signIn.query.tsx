import { createApi } from "@reduxjs/toolkit/query/react"
import { httpApi } from "../../base.query"

const reducerPath = "signInApi"

export const signInAPI = createApi({
  reducerPath,
  baseQuery: httpApi,
  endpoints: (build) => ({
    postSignIn: build.mutation<any, any>({
      query: (body) => {
        return {
          url: `/auth/login`,
          method: "POST",
          body,
          timeout: 10000
        }
      },
    }),
    fetchUserSignin: build.query<any, any>({
      query: (token) => {
        return {
          url: `/user/whoami`,
          headers: {
            "x-access-token": token
          }
        }
      },
    }),
    postValidateAuth: build.mutation<any, any>({
      query: (body) => {
        return {
          url: `/sign-in/validate-auth`,
          method: "POST",
          body,
          timeout: 10000
        }
      },
    }),
    getCheckAuth: build.query<any, any>({
      query: () => {
        return {
          url: `/sign-in/check-auth`,
          timeout: 10000
        }
      },
      transformResponse: (response: any) => {
        const data = response?.meta ?? ""
        return data
      }
    }),
    postSignOut: build.mutation<any, any>({
      query: (body) => {
        return {
          url: `/sign-in/destroy`,
          method: "POST",
          body,
          timeout: 10000
        }
      },
    }),
  }),
})

export const { usePostSignInMutation, usePostValidateAuthMutation, useGetCheckAuthQuery, usePostSignOutMutation, useLazyFetchUserSigninQuery } = signInAPI
export const signInQueryReducer = {
  [reducerPath]: signInAPI.reducer,
}