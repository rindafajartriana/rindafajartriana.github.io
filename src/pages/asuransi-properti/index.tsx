import React, { useState } from "react";

const AsuransiProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyValue: "",
    propertyType: "",
    coverageAmount: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    propertyValue: "",
    propertyType: "",
    coverageAmount: "",
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
    if (!formData.propertyValue) {
      validationErrors.propertyValue = "Nilai properti harus diisi.";
      isValid = false;
    }
    if (!formData.propertyType) {
      validationErrors.propertyType = "Pilih tipe properti.";
      isValid = false;
    }
    if (!formData.coverageAmount) {
      validationErrors.coverageAmount = "Jumlah pertanggungan harus diisi.";
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

          {/* Property Value */}
          <div className="mb-4">
            <label
              htmlFor="propertyValue"
              className="block text-sm font-medium text-gray-700"
            >
              Nilai Properti
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

          {/* Property Type */}
          <div className="mb-4">
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700"
            >
              Tipe Properti
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.propertyType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Tipe Properti</option>
              <option value="Residential">Perumahan</option>
              <option value="Commercial">Komersial</option>
              <option value="Industrial">Industri</option>
            </select>
            {errors.propertyType && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>

          {/* Coverage Amount */}
          <div className="mb-6">
            <label
              htmlFor="coverageAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Pertanggungan
            </label>
            <input
              type="number"
              id="coverageAmount"
              name="coverageAmount"
              value={formData.coverageAmount}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.coverageAmount ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan jumlah pertanggungan"
            />
            {errors.coverageAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.coverageAmount}</p>
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
