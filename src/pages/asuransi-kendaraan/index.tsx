import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const AsuransiKendaraan = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleYear: "",
    vehicleNumber: "",
    engineCapacity: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    vehicleType: "",
    vehicleBrand: "",
    vehicleYear: "",
    vehicleNumber: "",
    engineCapacity: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  const validateForm = () => {
    let validationErrors: any = {};
    let isValid = true;

    if (!formData.name) {
      validationErrors.name = "Nama harus diisi.";
      isValid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email tidak valid.";
      isValid = false;
    }
    if (!formData.vehicleType) {
      validationErrors.vehicleType = "Pilih tipe kendaraan.";
      isValid = false;
    }
    if (!formData.vehicleBrand) {
      validationErrors.vehicleBrand = "Merk kendaraan harus diisi.";
      isValid = false;
    }
    if (!formData.vehicleYear) {
      validationErrors.vehicleYear = "Tahun kendaraan harus diisi.";
      isValid = false;
    }
    if (!formData.vehicleNumber) {
      validationErrors.vehicleNumber = "Nomor polisi harus diisi.";
      isValid = false;
    }
    if (!formData.engineCapacity) {
      validationErrors.engineCapacity = "Kapasitas mesin harus diisi.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  return (
    <section className="container mx-auto py-0 px-6">
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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Formulir Asuransi Kendaraan
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Pemilik Kendaraan
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nama Anda"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan email Anda"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="mb-4">
            <label
              htmlFor="vehicleType"
              className="block text-sm font-medium text-gray-700"
            >
              Tipe Kendaraan
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.vehicleType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Tipe Kendaraan</option>
              <option value="Car">Mobil</option>
              <option value="Motorcycle">Motor</option>
            </select>
            {errors.vehicleType && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>
            )}
          </div>

          {/* Vehicle Brand */}
          <div className="mb-4">
            <label
              htmlFor="vehicleBrand"
              className="block text-sm font-medium text-gray-700"
            >
              Merk Kendaraan
            </label>
            <input
              type="text"
              id="vehicleBrand"
              name="vehicleBrand"
              value={formData.vehicleBrand}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.vehicleBrand ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan merk kendaraan"
            />
            {errors.vehicleBrand && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand}</p>
            )}
          </div>

          {/* Vehicle Year */}
          <div className="mb-4">
            <label
              htmlFor="vehicleYear"
              className="block text-sm font-medium text-gray-700"
            >
              Tahun Kendaraan
            </label>
            <input
              type="number"
              id="vehicleYear"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.vehicleYear ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan tahun kendaraan"
            />
            {errors.vehicleYear && (
              <p className="text-red-500 text-sm mt-1">{errors.vehicleYear}</p>
            )}
          </div>

          {/* Vehicle Number */}
          <div className="mb-4">
            <label
              htmlFor="vehicleNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Polisi
            </label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.vehicleNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nomor polisi kendaraan"
            />
            {errors.vehicleNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleNumber}
              </p>
            )}
          </div>

          {/* Engine Capacity */}
          <div className="mb-6">
            <label
              htmlFor="engineCapacity"
              className="block text-sm font-medium text-gray-700"
            >
              Kapasitas Mesin
            </label>
            <input
              type="number"
              id="engineCapacity"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.engineCapacity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan kapasitas mesin kendaraan"
            />
            {errors.engineCapacity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.engineCapacity}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Kirim Formulir
          </button>
        </form>
      </div>
    </section>
  );
};

export default AsuransiKendaraan;
