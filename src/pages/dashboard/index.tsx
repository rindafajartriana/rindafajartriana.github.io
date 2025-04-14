import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import {
  Building,
  Calendar,
  HomeInsurance,
  Structure,
} from "@assets/icons/_index";
import { setPopup } from "@store/redux-collection/popup";
import { useDispatch } from "react-redux";
import FormAdmin from "@pages/data-administrator/_form";
import { useGetListUserQuery } from "@store/redux-collection/master-data";
import { Link, useNavigate } from "react-router-dom";
import { FaCar  } from "react-icons/fa";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { GiCargoShip } from "react-icons/gi";
import { IoConstructOutline } from "react-icons/io5";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Slider Section */}
      <div className="container mx-auto py-8 mt-16 w-[60%]">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 3000, // Slide every 3 seconds
            disableOnInteraction: false, // Continue autoplay even when interacting with the Swiper
          }}
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <img src="/img/main.webp" alt="Slide 1" className="w-full h-auto" />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/mobil.webp"
              alt="Slide 2"
              className="w-full h-auto"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/img/properti.webp"
              alt="Slide 3"
              className="w-full h-auto"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Hero Section (Banner) */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-500 text-white text-center py-8">
        <h1 className="text-2xl font-semibold mb-2">Cek Premi Asuransi Anda</h1>
        <p className="text-xl mb-2">
          Bandingkan premi asuransi terbaik dari berbagai penyedia.
        </p>
        <button className="px-6 py-3 bg-white text-blue-500 rounded-full hover:bg-gray-100">
          Mulai Cek Premi
        </button>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:mx-[8rem] lg:grid-cols-6 lg:mx-[10rem] gap-y-2 -gap-x-2 place-items-center">
          {/* Asuransi Kendaraan */}
          <div
            onClick={() => {
              navigate("/asuransi-kendaraan");
            }}
            className="bg-gradient-to-r from-blue-800 to-blue-500 p-4 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-36 h-36 group transition duration-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:cursor-pointer animate-scaleIn"
          >
            <div className="flex justify-center mb-2 transform transition duration-200 group-hover:scale-90">
              <FaCar className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-bold text-xs text-white transform transition duration-200 group-hover:scale-90">
              Asuransi Kendaraan
            </h2>
          </div>

          {/* Asuransi Properti */}
          <div
            onClick={() => {
              navigate("/asuransi-properti");
            }}
            className="bg-gradient-to-r from-blue-800 to-blue-500 p-4 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-36 h-36 group transition duration-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:cursor-pointer animate-scaleIn"
          >
            <div className="flex justify-center mb-2 transform transition duration-200 group-hover:scale-90">
              <MdOutlineMapsHomeWork className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-bold text-xs text-white transform transition duration-200 group-hover:scale-90">
              Asuransi Properti
            </h2>
          </div>

          <div
            onClick={() => {
              navigate("/asuransi-kargo");
            }}
            className="bg-gradient-to-r from-blue-800 to-blue-500 p-4 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-36 h-36 group transition duration-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:cursor-pointer animate-scaleIn"
          >
            <div className="flex justify-center mb-2 transform transition duration-200 group-hover:scale-90">
              <GiCargoShip className="h-10 w-10 text-white" />
            </div>
            <h2 className="font-bold text-xs text-white transform transition duration-200 group-hover:scale-90">
              Asuransi Kargo
            </h2>
          </div>

          {/* Asuransi Kargo */}
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r from-blue-800 to-blue-500 p-4 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-36 h-36 group transition duration-200 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:cursor-pointer animate-scaleIn`}
              style={{ animationDelay: `${index * 50}ms` }} // ✨ Delay agar masuknya bertahap
            >
              <div className="flex justify-center mb-2 transform transition duration-200 group-hover:scale-90">
                <IoConstructOutline className="h-10 w-10 text-white" />
              </div>
              <h2 className="font-bold text-xs text-white transform transition duration-200 group-hover:scale-90">
                Coming Soon
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Testimoni Section */}
      <div className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-10">
            Apa Kata Mereka?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimoni 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-500 mb-4 italic">
                "CekPremi sangat membantu saya menemukan asuransi kendaraan yang
                sesuai dengan kebutuhan saya. Prosesnya cepat dan transparan!"
              </p>
              <h4 className="font-semibold text-blue-500">Andi Saputra</h4>
              <span className="text-sm text-gray-500">Pengguna sejak 2023</span>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-500 mb-4 italic">
                "Saya berhasil mengasuransikan rumah saya dengan premi yang
                lebih murah dibandingkan platform lain. Highly recommended!"
              </p>
              <h4 className="font-semibold text-blue-500">Sinta Lestari</h4>
              <span className="text-sm text-gray-500">Pemilik Properti</span>
            </div>

            {/* Testimoni 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-500 mb-4 italic">
                "Platform ini user-friendly banget. Dalam hitungan menit saya
                sudah bisa lihat dan bandingkan premi dari berbagai provider."
              </p>
              <h4 className="font-semibold text-blue-500">Rizky Hidayat</h4>
              <span className="text-sm text-gray-500">Wirausaha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Website Section */}
      <div className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tentang CekPremi
        </h2>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
          <span className="font-semibold text-blue-500">CekPremi</span> adalah
          platform digital yang memudahkan Anda untuk membandingkan berbagai
          jenis asuransi dari berbagai penyedia terpercaya di Indonesia. Dengan
          antarmuka yang intuitif dan fitur yang mudah digunakan, Anda dapat
          menemukan dan memilih asuransi terbaik sesuai kebutuhan Anda — mulai
          dari kendaraan, properti, hingga kargo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              🔎 Bandingkan dengan Mudah
            </h3>
            <p className="text-gray-500">
              Lihat dan bandingkan premi dari berbagai penyedia asuransi hanya
              dalam beberapa klik.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              ⚡ Proses Cepat
            </h3>
            <p className="text-gray-500">
              Cek premi dan ajukan asuransi Anda dengan proses yang cepat dan
              tanpa ribet.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-500 mb-2">
              ✅ Terpercaya
            </h3>
            <p className="text-gray-500">
              Bekerjasama dengan perusahaan asuransi ternama dan terdaftar resmi
              di OJK.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
