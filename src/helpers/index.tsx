export const baseUrl = (params: any) => {
  return window.location.origin + params;
}

export const apiUrl = (params: any) => {
  return import.meta.env.VITE_API_DIR + params;
}

export const getPathNavigation = (roleAkses: any) => {
  let path
  switch (roleAkses) {
    case "web_akunting":
      path = import.meta.env.VITE_WEB_AKUNTING
      break
    case "web_pabrik":
      path = import.meta.env.VITE_WEB_PABRIK
      break
    default:
      path = ""
      break;
  }
  return path
}

export const getErrorMessage = (err: any) => {
  return typeof err === 'string' ? err : err?.data?.meta?.message ?? "Terjadi kesalahan"
}

// export const imageApi = "http://" + import.meta.env.VITE_API