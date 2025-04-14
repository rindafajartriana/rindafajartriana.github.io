import React, { useState } from "react";

const AsuransiKargo = () => {
  const [formData, setFormData] = useState({
    goodsType: "",
    goodsQuantity: "",
    packingType: "",
    coverageValue: "",
    addProfit: false,
    shippingRoute: "",
    claimExperience: "",
    hasFireExtinguisher: false,
    claimExperienceLast3Years: "",
    buildingPhotos: [],
  });

  const [errors, setErrors] = useState({
    goodsType: "",
    goodsQuantity: "",
    packingType: "",
    coverageValue: "",
    shippingRoute: "",
    claimExperience: "",
    buildingPhotos: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 6) {
      setErrors({ ...errors, buildingPhotos: "Maksimal 6 foto." });
    } else {
      setFormData({ ...formData, buildingPhotos: files });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  const validateForm = () => {
    let validationErrors: any;
    let isValid = true;

    if (!formData.goodsType) {
      validationErrors.goodsType = "Jenis barang harus diisi.";
      isValid = false;
    }

    if (!formData.goodsQuantity) {
      validationErrors.goodsQuantity = "Jumlah barang harus diisi.";
      isValid = false;
    }

    if (!formData.packingType) {
      validationErrors.packingType = "Jenis packing harus diisi.";
      isValid = false;
    }

    if (!formData.coverageValue) {
      validationErrors.coverageValue = "Nilai pertanggungan harus diisi.";
      isValid = false;
    }

    if (!formData.shippingRoute) {
      validationErrors.shippingRoute = "Rute pengiriman harus diisi.";
      isValid = false;
    }

    if (!formData.claimExperience) {
      validationErrors.claimExperience = "Pengalaman klaim harus diisi.";
      isValid = false;
    }

    if (!formData.buildingPhotos || formData.buildingPhotos.length === 0) {
      validationErrors.buildingPhotos = "Foto bangunan harus diunggah.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  return (
    <section className="container mx-auto py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Formulir Asuransi Kargo
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Jenis Barang */}
          <div className="mb-4">
            <label
              htmlFor="goodsType"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Barang
            </label>
            <input
              type="text"
              id="goodsType"
              name="goodsType"
              value={formData.goodsType}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.goodsType ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan jenis barang"
            />
            {errors.goodsType && (
              <p className="text-red-500 text-sm mt-1">{errors.goodsType}</p>
            )}
          </div>

          {/* Jumlah Barang */}
          <div className="mb-4">
            <label
              htmlFor="goodsQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Jumlah Barang
            </label>
            <input
              type="number"
              id="goodsQuantity"
              name="goodsQuantity"
              value={formData.goodsQuantity}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.goodsQuantity ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan jumlah barang"
            />
            {errors.goodsQuantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.goodsQuantity}
              </p>
            )}
          </div>

          {/* Jenis Packing */}
          <div className="mb-4">
            <label
              htmlFor="packingType"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Packing
            </label>
            <select
              id="packingType"
              name="packingType"
              value={formData.packingType}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.packingType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Jenis Packing</option>
              <option value="Wood">Packing Kayu</option>
              <option value="Plastic">Packing Plastik</option>
              <option value="Cardboard">Packing Kardus</option>
              <option value="Strapping">Strapping Band</option>
              <option value="BubbleWrap">Bubble Wrap</option>
              <option value="Envelope">Amplop</option>
              <option value="Sack">Karung</option>
              <option value="ShrinkFilm">Shrink Film</option>
              <option value="Other">Lainnya</option>
            </select>
            {errors.packingType && (
              <p className="text-red-500 text-sm mt-1">{errors.packingType}</p>
            )}
          </div>

          {/* Nilai Pertanggungan */}
          <div className="mb-4">
            <label
              htmlFor="coverageValue"
              className="block text-sm font-medium text-gray-700"
            >
              Nilai Pertanggungan
            </label>
            <input
              type="number"
              id="coverageValue"
              name="coverageValue"
              value={formData.coverageValue}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.coverageValue ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nilai pertanggungan"
            />
            {errors.coverageValue && (
              <p className="text-red-500 text-sm mt-1">
                {errors.coverageValue}
              </p>
            )}
          </div>

          {/* Profit Option */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="addProfit"
                checked={formData.addProfit}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm text-gray-700">
                Tambahkan 10% Profit
              </span>
            </label>
          </div>

          {/* Rute Pengiriman */}
          <div className="mb-4">
            <label
              htmlFor="shippingRoute"
              className="block text-sm font-medium text-gray-700"
            >
              Rute Pengiriman
            </label>
            <input
              type="text"
              id="shippingRoute"
              name="shippingRoute"
              value={formData.shippingRoute}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.shippingRoute ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan rute pengiriman (dari dan ke)"
            />
            {errors.shippingRoute && (
              <p className="text-red-500 text-sm mt-1">
                {errors.shippingRoute}
              </p>
            )}
          </div>

          {/* Pengalaman Klaim */}
          <div className="mb-4">
            <label
              htmlFor="claimExperience"
              className="block text-sm font-medium text-gray-700"
            >
              Pengalaman Klaim 3 Tahun Terakhir
            </label>
            <input
              type="text"
              id="claimExperience"
              name="claimExperience"
              value={formData.claimExperience}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.claimExperience ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan pengalaman klaim"
            />
            {errors.claimExperience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.claimExperience}
              </p>
            )}
          </div>

          {/* Foto Bangunan */}
          <div className="mb-4">
            <label
              htmlFor="buildingPhotos"
              className="block text-sm font-medium text-gray-700"
            >
              Foto Bangunan (min. 2, max. 6 foto)
            </label>
            <input
              type="file"
              id="buildingPhotos"
              name="buildingPhotos"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.buildingPhotos ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.buildingPhotos && (
              <p className="text-red-500 text-sm mt-1">
                {errors.buildingPhotos}
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

export default AsuransiKargo;
