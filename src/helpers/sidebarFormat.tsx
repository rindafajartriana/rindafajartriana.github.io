import _ from "lodash"
import YourPageName from "../pages/your-page-name" //#changeThis
import NotFound from "../components/template/notFound"

const findComponent = (route: string) => {
  switch (route) {
    case "new-page": //#changeThis nama_route columns at table basic_menu
      return YourPageName //#changeThis your new main component for its route
    default:
      return NotFound
  }
}

export const routeFormat = (data: any) => {
  const newFormatData = _.map(data, idx => {
    const newObj: any = {}
    newObj.id_access = idx?.id_access
    newObj.component = findComponent(idx?.nama_route)
    newObj.path = idx?.path?.substring(1) ?? ""
    newObj.disabled = idx?.disabled
    return newObj
  })

  return newFormatData
}