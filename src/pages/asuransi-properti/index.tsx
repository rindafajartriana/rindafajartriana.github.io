import React, { useState } from "react";

const AsuransiProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyAddress: "",
    propertyUsage: "",
    propertyValue: "",
    buildingClass: "",
    fireExtinguisher: false,
    claimExperience: "",
    photos: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    propertyAddress: "",
    propertyUsage: "",
    propertyValue: "",
    buildingClass: "",
    fireExtinguisher: "",
    claimExperience: "",
    photos: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 6) {
      setErrors({ ...errors, photos: "Maksimal 6 foto" });
    } else {
      setFormData({
        ...formData,
        photos: Array.from(files),
      });
      setErrors({ ...errors, photos: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  const validateForm = () => {
    let validationErrors:any;
    let isValid = true;

    if (!formData.name) {
      validationErrors.name = "Nama harus diisi.";
      isValid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Email tidak valid.";
      isValid = false;
    }
    if (!formData.propertyAddress) {
      validationErrors.propertyAddress = "Alamat properti harus diisi.";
      isValid = false;
    }
    if (!formData.propertyUsage) {
      validationErrors.propertyUsage = "Tipe usaha harus diisi.";
      isValid = false;
    }
    if (!formData.propertyValue) {
      validationErrors.propertyValue = "Nilai properti harus diisi.";
      isValid = false;
    }
    if (!formData.buildingClass) {
      validationErrors.buildingClass = "Kelas konstruksi harus diisi.";
      isValid = false;
    }
    if (formData.photos.length < 2) {
      validationErrors.photos = "Minimal 2 foto diperlukan.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  return (
    <section className="container mx-auto py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Formulir Asuransi Properti
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Pemilik Properti
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

          {/* Property Address */}
          <div className="mb-4">
            <label
              htmlFor="propertyAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Alamat Lokasi Properti
            </label>
            <input
              type="text"
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.propertyAddress ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan alamat properti"
            />
            {errors.propertyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyAddress}</p>
            )}
          </div>

          {/* Property Usage */}
          <div className="mb-4">
            <label
              htmlFor="propertyUsage"
              className="block text-sm font-medium text-gray-700"
            >
              Objek Digunakan Untuk Jenis Usaha
            </label>
            <select
              id="propertyUsage"
              name="propertyUsage"
              value={formData.propertyUsage}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.propertyUsage ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Jenis Usaha</option>
              <option value="Residential">Rumah Tinggal</option>
              <option value="Commercial">Toko</option>
              <option value="Restaurant">Restoran</option>
              <option value="Industrial">Pabrik</option>
            </select>
            {errors.propertyUsage && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyUsage}</p>
            )}
          </div>

          {/* Property Value */}
          <div className="mb-4">
            <label
              htmlFor="propertyValue"
              className="block text-sm font-medium text-gray-700"
            >
              Nilai Properti (Bangunan dan Isi)
            </label>
            <input
              type="number"
              id="propertyValue"
              name="propertyValue"
              value={formData.propertyValue}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.propertyValue ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nilai properti"
            />
            {errors.propertyValue && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyValue}</p>
            )}
          </div>

          {/* Building Class */}
          <div className="mb-4">
            <label
              htmlFor="buildingClass"
              className="block text-sm font-medium text-gray-700"
            >
              Kelas Konstruksi Bangunan
            </label>
            <select
              id="buildingClass"
              name="buildingClass"
              value={formData.buildingClass}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.buildingClass ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Kelas Konstruksi</option>
              <option value="1">Kelas 1</option>
              <option value="2">Kelas 2</option>
              <option value="3">Kelas 3</option>
            </select>
            {errors.buildingClass && (
              <p className="text-red-500 text-sm mt-1">{errors.buildingClass}</p>
            )}
          </div>

          {/* Fire Extinguisher */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="fireExtinguisher"
              name="fireExtinguisher"
              checked={formData.fireExtinguisher}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label
              htmlFor="fireExtinguisher"
              className="text-sm text-gray-700"
            >
              Memiliki Alat Pemadam Api Ringan
            </label>
          </div>

          {/* Claim Experience */}
          <div className="mb-4">
            <label
              htmlFor="claimExperience"
              className="block text-sm font-medium text-gray-700"
            >
              Pengalaman Klaim 3 Tahun Terakhir
            </label>
            <textarea
              id="claimExperience"
              name="claimExperience"
              value={formData.claimExperience}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.claimExperience ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Jelaskan pengalaman klaim (jika ada)"
            />
            {errors.claimExperience && (
              <p className="text-red-500 text-sm mt-1">{errors.claimExperience}</p>
            )}
          </div>

          {/* Photos */}
          <div className="mb-4">
            <label
              htmlFor="photos"
              className="block text-sm font-medium text-gray-700"
            >
              Foto Bangunan (Minimal 2 Foto, Maksimal 6 Foto)
            </label>
            <input
              type="file"
              id="photos"
              name="photos"
              multiple
              onChange={handleFileChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.photos ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.photos && (
              <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
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

export default AsuransiProperty;
