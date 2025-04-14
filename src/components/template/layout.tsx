import { ArrowRight } from "@assets/icons/_index";
import Sidebar from "@components/organisms/sidebar";
import Topbar from "@components/organisms/topbar";
import { IRootState } from "@store/redux-collection";
import { setIsOpenSidebar } from "@store/redux-collection/dummy";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { HiChevronDown, HiChevronUp, HiMenu, HiX } from 'react-icons/hi';

const Layout = ({ children, name, accessType }: any) => {
  const dispatch = useDispatch();
  const [openKendaraan, setOpenKendaraan] = useState(false);
  const [openProperti, setOpenProperti] = useState(false);
  const [openKargo, setOpenKargo] = useState(false);
  const [openLainnya, setOpenLainnya] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isOpenSidebar: isOpen } = useSelector(
    (state: IRootState) => state.dummy
  );

  return (
    <div className="font-poppins bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="text-black p-4 border-b-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold cursor-pointer">
          CekPremi
        </Link>

        {/* Burger Icon (mobile only) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl"
        >
          {mobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Menu - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dropdown Group */}
          <DropdownMenu
            label="Asuransi Kendaraan"
            isOpen={openKendaraan}
            setOpen={setOpenKendaraan}
            links={[
              { to: '/asuransi-kendaraan', label: 'Mobil' },
              { to: '/kendaraan/motor', label: 'Motor' },
            ]}
          />

          <DropdownMenu
            label="Asuransi Properti"
            isOpen={openProperti}
            setOpen={setOpenProperti}
            links={[
              { to: '/properti/rumah', label: 'Rumah' },
              { to: '/properti/apartemen', label: 'Apartemen' },
            ]}
          />

          <DropdownMenu
            label="Asuransi Kargo"
            isOpen={openKargo}
            setOpen={setOpenKargo}
            links={[
              { to: '/kargo/domestik', label: 'Pengiriman Domestik' },
              { to: '/kargo/internasional', label: 'Pengiriman Internasional' },
              { to: '/kargo/lautan', label: 'Kargo Laut' },
              { to: '/kargo/udara', label: 'Kargo Udara' },
              { to: '/kargo/logistik-komersial', label: 'Logistik Komersial' },
            ]}
          />

          <DropdownMenu
            label="Asuransi Lainnya"
            isOpen={openLainnya}
            setOpen={setOpenLainnya}
            links={[
              { to: '/lainnya/perjalanan', label: 'Asuransi Perjalanan' },
              { to: '/lainnya/kesehatan', label: 'Asuransi Kesehatan' },
            ]}
          />
        </div>

        {/* Masuk Button - Desktop */}
        <div className="hidden md:block">
          <button className="text-sm font-bold px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-white">
            Masuk
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {/* Masuk Button */}
          <button className="w-full text-sm font-bold px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded text-white">
            Masuk
          </button>

          {/* Mobile Dropdowns */}
          <MobileDropdown label="Asuransi Kendaraan" links={[
            { to: '/asuransi-kendaraan', label: 'Mobil' },
            { to: '/kendaraan/motor', label: 'Motor' },
          ]} />

          <MobileDropdown label="Asuransi Properti" links={[
            { to: '/properti/rumah', label: 'Rumah' },
            { to: '/properti/apartemen', label: 'Apartemen' },
          ]} />

          <MobileDropdown label="Asuransi Kargo" links={[
            { to: '/kargo/domestik', label: 'Pengiriman Domestik' },
            { to: '/kargo/internasional', label: 'Pengiriman Internasional' },
            { to: '/kargo/lautan', label: 'Kargo Laut' },
            { to: '/kargo/udara', label: 'Kargo Udara' },
            { to: '/kargo/logistik-komersial', label: 'Logistik Komersial' },
          ]} />

          <MobileDropdown label="Asuransi Lainnya" links={[
            { to: '/lainnya/perjalanan', label: 'Asuransi Perjalanan' },
            { to: '/lainnya/kesehatan', label: 'Asuransi Kesehatan' },
          ]} />
        </div>
      )}
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

const DropdownMenu = ({ label, isOpen, setOpen, links }) => (
  <div
    className="relative"
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
  >
    <div className="flex items-center text-sm cursor-pointer">
      <span className="whitespace-nowrap">{label}</span>
      {isOpen ? (
        <HiChevronUp className="ml-1 text-base" />
      ) : (
        <HiChevronDown className="ml-1 text-base" />
      )}
    </div>
    {isOpen && (
      <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-2 w-48 border text-sm z-10">
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.to} className="block px-4 py-2 hover:bg-gray-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Mobile Dropdown (accordion style)
const MobileDropdown = ({ label, links }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-2 text-sm font-medium"
      >
        {label}
        {open ? <HiChevronUp /> : <HiChevronDown />}
      </button>
      {open && (
        <ul className="bg-white text-sm">
          {links.map((link, index) => (
            <li key={index}>
              <Link to={link.to} className="block px-6 py-2 hover:bg-gray-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Layout;
