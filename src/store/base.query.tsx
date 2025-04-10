import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { signOut } from './redux-collection/sign-in/signIn.slice';

export const getToken = state => state.signIn || null;
export const baseHttp = fetchBaseQuery({
  baseUrl: "http://",
  prepareHeaders: async (headers, { getState, endpoint }) => {
    if (endpoint.toLowerCase().includes('upload')) {
      // headers.set('content-type', 'multipart/form-data');
      // headers.set('Access-Control-Allow-Origin', '*');
    } else {
      headers.set('content-type', 'application/json');
    }
    // put token in header
    const { data } = await getToken(getState());
    if (data?.token) headers.set('x-access-token', `${data?.token}`);

    return headers;
  },
})

export const http = async (args: any, api: any, extraOptions: any) => {
  const adjustedUrl = extraOptions?.url
  const adjustedArgs = typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl + args?.url }
  let result = await baseHttp(adjustedArgs, api, extraOptions)
  const { data } = await getToken(api.getState())
  if (result.error && result.error.status === 401) {
    if (data?.token) api.dispatch(signOut())
  }
  return result;
}

//BEGIN TO DEFINE API FOR CREATE
const GLOBAL_API = `${import.meta.env.VITE_API}/api/v1`
// const MY_API = `${import.meta.env.VITE_API_MY_BACKEND}/api/v1/web/{{backend-api-path}}` //#changeThis

export const httpApi = async (args: any, api: any, extraOptions: any) => {
  let newExtraOptions: any = { origin: extraOptions }
  newExtraOptions.url = GLOBAL_API
  return await http(args, api, newExtraOptions)
}
// export const httpMyApi = async (args: any, api: any, extraOptions: any) => {
//   let newExtraOptions: any = { origin: extraOptions }
//   newExtraOptions.url = MY_API
//   return await http(args, api, newExtraOptions)
// }

//OTHER BASIC URL
export const basicHttp = () =>
  fetchBaseQuery({
    baseUrl: GLOBAL_API,
  });

export default http