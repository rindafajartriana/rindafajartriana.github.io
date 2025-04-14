import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import _ from "lodash";
import Layout from "./components/template/layout";
import LayoutAdmin from "./components/template/layoutAdmin";
import SigninPage from "@pages/signin";
import { useSelector } from "react-redux";
import { IRootState } from "@store/redux-collection";
import Dashboard from "@pages/dashboard";
import { AnyObj } from "@type";
import { useCallback } from "react";
import AsuransiProperty from "@pages/asuransi-properti";
import AsuransiKendaraan from "@pages/asuransi-kendaraan";
import AsuransiKargo from "@pages/asuransi-kargo";

function App() {
  const privateRoutes = useSelector((state: IRootState) => state.dummy.privateRoutes);
  const { data } = useSelector((state: IRootState) => state.signIn);
  const { dataCust } = useSelector((state: IRootState) => state.signIn);

  // Cek status login admin
  const isAdmin = !!data?.token;

  // Cek akses admin
  function PrivateOutlet() {
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
  }

  // Cek jika admin sudah login, jangan arahkan ke /login-admin
  function AuthOutlet() {
    // Jika sudah login sebagai admin, arahkan ke halaman utama (bukan login-admin)
    if (isAdmin) {
      return <Navigate to="/admin/" />;
    }
    return <Outlet />;
  }

  const getAccess: (props: AnyObj) => AnyObj = useCallback((menuAccess) => {
    let newAcc = {};
    for (const x of Object.keys(menuAccess ?? {})) {
      newAcc[x] = menuAccess?.[x]?.includes?.(data?.userInfo?.access_type);
    }
    return newAcc;
  }, [data?.userInfo?.access_type]);

  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<AuthOutlet />}>
          <Route path="*" element={<div>Halaman tidak ditemukan</div>} />
          <Route path="" element={<Layout><Dashboard /></Layout>} />
          <Route path="login-admin" element={<SigninPage />} /> {/* Admin login hanya bisa dari sini */}
          <Route path="asuransi-kendaraan" element={<Layout><AsuransiKendaraan /></Layout>} />
          <Route path="asuransi-properti" element={<Layout><AsuransiProperty /></Layout>} />
          <Route path="asuransi-kargo" element={<Layout><AsuransiKargo /></Layout>} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="admin/" element={<PrivateOutlet />}>
          <Route path="*" element={<LayoutAdmin name={"Oops!"}><div className="main-container">Halaman tidak ditemukan</div></LayoutAdmin>} />
          {
            _.map(_.filter(privateRoutes, (x: any) => x?.component && getAccess(x?.access)?.view), (idx: any, key: any) => (
              <Route key={key} path={idx?.path}
                element={<LayoutAdmin name={idx?.name} accessType={getAccess(idx?.access)}>
                  <idx.component accessType={getAccess(idx?.access)} />
                </LayoutAdmin>}
              />
            ))
          }
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
