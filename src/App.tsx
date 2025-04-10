import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import _ from "lodash";
import Spinner from "./components/atoms/spinner";
import Layout from "./components/template/layout";
import SigninPage from "@pages/signin";
import { useSelector } from "react-redux";
import { IRootState } from "@store/redux-collection";
import RegisterPage from "@pages/register";
import Dashboard from "@pages/dashboard";
import { AnyObj } from "@type";
import { useCallback, useMemo } from "react";
import AsuransiProperty from "@pages/asuransi-properti";
import AsuransiKendaraan from "@pages/asuransi-kendaraan";
import AsuransiKargo from "@pages/asuransi-kargo";

type AccessType = "SU" | "PENGURUS" | "ANGGOTA"

// export const getAccess = (menuAccess: AnyObj, userAccess: AccessType) => {
//   let newAcc = {}
//   for (const x of Object.keys(menuAccess ?? {})) {
//     newAcc[x] = menuAccess?.[x]?.includes?.(userAccess)
//   }
//   return newAcc
// }

function App() {
  const privateRoutes = useSelector((state: IRootState) => state.dummy.privateRoutes)
  const { data } = useSelector((state: IRootState) => state.signIn)

  function PrivateOutlet() {
    return data?.token ? <Outlet /> : <Navigate to="/" />;
  }
  function AuthOutlet() {
    return data?.token ? <Navigate to="/admin/" /> : <Outlet />
  }
  const getAccess: (props: AnyObj) => AnyObj = useCallback((menuAccess) => {
    let newAcc = {}
    for (const x of Object.keys(menuAccess ?? {})) {
      newAcc[x] = menuAccess?.[x]?.includes?.(data?.userInfo?.access_type)
      // newAcc[x] = menuAccess?.[x]?.includes?.("ANGGOTA")
    }
    return newAcc
  }, [data?.userInfo?.access_type])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthOutlet />}>
          <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          <Route path="" element={<Layout><Dashboard /></Layout>} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="asuransi-kendaraan" element={<Layout><AsuransiKendaraan /></Layout>} />
          <Route path="asuransi-properti" element={<Layout><AsuransiProperty /></Layout>} />
          <Route path="asuransi-kargo" element={<Layout><AsuransiKargo /></Layout>} />
        </Route>
        <Route path="admin/" element={<PrivateOutlet />}>
          <Route path="*" element={<Layout name={"Oops!"}><div className="main-container">Halaman tidak ditemukan</div></Layout>} />
          {
            _.map(_.filter(privateRoutes, (x: any) => x?.component && getAccess(x?.access)?.view), (idx: any, key: any) => (
              <Route key={key} path={idx?.path}
                element={<Layout name={idx?.name} accessType={getAccess(idx?.access)}>
                  <idx.component accessType={getAccess(idx?.access)} />
                </Layout>}
              />
            ))
          }
        </Route>
      </Routes>
    </BrowserRouter >
  );
}

export default App;