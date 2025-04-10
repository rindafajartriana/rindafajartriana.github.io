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

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* Slider Section */}
      <div className="container mx-auto py-8 w-[50%]">
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
      <div className="bg-blue-500 text-white text-center py-16">
        <h1 className="text-2lg font-semibold mb-4">Cek Premi Asuransi Anda</h1>
        <p className="text-lg mb-8">
          Bandingkan premi asuransi terbaik dari berbagai penyedia.
        </p>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100">
          Mulai Cek Premi
        </button>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Asuransi Kendaraan */}
          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Structure className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kendaraan</h2>
          </div>

          {/* Asuransi Properti */}
          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Building className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Properti</h2>
          </div>

          {/* Asuransi Kargo */}
          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          {/* Additional Asuransi Sections */}
          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>

          <div className="bg-blue-600 p-6 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-48 h-48">
            <div className="flex justify-center mb-4">
              <Calendar className="h-16 w-16 text-white" />
            </div>
            <h2 className="font-bold text-xl text-white">Asuransi Kargo</h2>
          </div>
        </div>
      </div>

      {/* Testimoni Section */}
      <div className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Apa Kata Mereka?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimoni 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-600 mb-4 italic">
                "CekPremi sangat membantu saya menemukan asuransi kendaraan yang
                sesuai dengan kebutuhan saya. Prosesnya cepat dan transparan!"
              </p>
              <h4 className="font-semibold text-blue-600">Andi Saputra</h4>
              <span className="text-sm text-gray-500">Pengguna sejak 2023</span>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-600 mb-4 italic">
                "Saya berhasil mengasuransikan rumah saya dengan premi yang
                lebih murah dibandingkan platform lain. Highly recommended!"
              </p>
              <h4 className="font-semibold text-blue-600">Sinta Lestari</h4>
              <span className="text-sm text-gray-500">Pemilik Properti</span>
            </div>

            {/* Testimoni 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <p className="text-gray-600 mb-4 italic">
                "Platform ini user-friendly banget. Dalam hitungan menit saya
                sudah bisa lihat dan bandingkan premi dari berbagai provider."
              </p>
              <h4 className="font-semibold text-blue-600">Rizky Hidayat</h4>
              <span className="text-sm text-gray-500">Wirausaha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Website Section */}
      <div className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Tentang CekPremi
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          <span className="font-semibold text-blue-600">CekPremi</span> adalah
          platform digital yang memudahkan Anda untuk membandingkan berbagai
          jenis asuransi dari berbagai penyedia terpercaya di Indonesia. Dengan
          antarmuka yang intuitif dan fitur yang mudah digunakan, Anda dapat
          menemukan dan memilih asuransi terbaik sesuai kebutuhan Anda — mulai
          dari kendaraan, properti, hingga kargo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              🔎 Bandingkan dengan Mudah
            </h3>
            <p className="text-gray-600">
              Lihat dan bandingkan premi dari berbagai penyedia asuransi hanya
              dalam beberapa klik.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              ⚡ Proses Cepat
            </h3>
            <p className="text-gray-600">
              Cek premi dan ajukan asuransi Anda dengan proses yang cepat dan
              tanpa ribet.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              ✅ Terpercaya
            </h3>
            <p className="text-gray-600">
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
