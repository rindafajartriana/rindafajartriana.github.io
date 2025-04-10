import { ArrowRight } from "@assets/icons/_index";
import Sidebar from "@components/organisms/sidebar";
import Topbar from "@components/organisms/topbar";
import { IRootState } from "@store/redux-collection";
import { setIsOpenSidebar } from "@store/redux-collection/dummy";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Layout = ({ children, name, accessType }: any) => {
  const dispatch = useDispatch();
  const { isOpenSidebar: isOpen } = useSelector(
    (state: IRootState) => state.dummy
  );

  return (
    // <div className="custom-body">
    //   <div className="flex flex-col w-full">
    //     <Topbar />
    //     <div className="flex h-full font-poppins">
    //       <Sidebar accessType={accessType} />
    //       <div className="flex flex-col w-full bg-slate-200 font-roboto">
    //         {
    //           isOpen &&
    //           <div onClick={() => dispatch(setIsOpenSidebar(!isOpen))} className="fixed visible md:invisible bg-black/50 backdrop-blur-sm z-10 w-full h-full" />
    //         }
    //         <div className="flex flex-col md:flex-row justify-between gap-2">
    //           <div className="mt-3 items-end gap-3 w-fit mx-4">
    //             <h1 className="whitespace-nowrap ">{name}</h1>
    //             <h2 className="text-gray-500 whitespace-nowrap">{moment().format("dddd, DD MMMM YYYY")}</h2>
    //           </div>
    //           <div className="flex h-full items-end justify-end">
    //             <div className="flex text-sm text-gray-500 mx-4 items-center gap-2">
    //               <NavLink to="/admin/" className={() => ""}>Home</NavLink>
    //               <ArrowRight width={14} />
    //               <p className="whitespace-nowrap">{name}</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex flex-col w-full h-full">
    //           <div className="flex w-full h-full">
    //             {children}
    //           </div>
    //           <div className="flex text-gray-500 gap-2 p-4 justify-between bg-white text-xs md:text-sm">
    //             <p className="flex gap-2">
    //               <span className="text-black font-semibold">Hak Cipta © 2025.Team 5R</span>
    //               <span>PT. Sarana Makin Mulya.</span>
    //             </p>
    //             <p>Versi 1.0</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="font-poppins bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/" className="text-lg font-bold cursor-pointer">
              CekPremi
            </Link>
          </div>
          <div>
            <button className="text-lg font-bold px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-white">
              Login
            </button>
          </div>
        </div>
      </header>
      <div className="flex w-full h-full">{children}</div>
      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CekPremi</h3>
            <p className="mb-2">PT Cek Premi Organization</p>
            <p className="mb-2">
              CIBIS 9, 17th Floor <br />
              Jl. TB Simatupang No.2, Cilandak Timur <br />
              Pasar Minggu, Jakarta Selatan 12560
            </p>
            <a
              href="https://goo.gl/maps/example" // Replace with real link
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Lihat di Google Maps
            </a>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Layanan Customer Support
            </h3>
            <ul className="space-y-2">
              <li>
                <strong>WhatsApp (Chat Only):</strong>{" "}
                <a
                  href="https://wa.me/6281234567890"
                  className="text-blue-400 hover:underline"
                >
                  0812 345 678 90
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@cekpremi.com"
                  className="text-blue-400 hover:underline"
                >
                  support@cekpremi.com
                </a>
              </li>
              <li>
                <strong>Telepon:</strong>{" "}
                <a
                  href="tel:02123456789"
                  className="text-blue-400 hover:underline"
                >
                  021 234 567 89
                </a>
              </li>
              <li>
                <strong>Jam Operasional:</strong> Senin - Sabtu, 08.00 - 17.00
                WIB
              </li>
              <li>
                <strong>Hari Libur Nasional:</strong> Libur
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
            <ul className="space-y-2">
              <li>✔️ Berizin dan diawasi oleh OJK</li>
              <li>
                <strong>Pengaduan Konsumen:</strong>
                <br />
                Direktorat Jenderal Perlindungan Konsumen & Tertib Niaga, <br />
                Kementerian Perdagangan RI.
                <br />
                WhatsApp:{" "}
                <a
                  href="https://wa.me/6285311111010"
                  className="text-blue-400 hover:underline"
                >
                  0853-1111-1010
                </a>
              </li>
              <li>
                <strong>Metode Pembayaran:</strong> Transfer, Kartu Kredit,
                Cicilan 0%
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                |{" "}
                <a href="#" className="text-blue-400 hover:underline">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4 flex space-x-4">
              <a href="#" className="hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="hover:text-pink-400">
                Instagram
              </a>
              <a href="#" className="hover:text-red-500">
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-12 text-xs">
          &copy; {new Date().getFullYear()} CekPremi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
