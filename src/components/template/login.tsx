import Button from "@components/atoms/button";
import Spinner from "@components/atoms/spinner";
import { getErrorMessage } from "@helpers";
import { IRootState } from "@store/redux-collection";
import { clearPopup, setPopup } from "@store/redux-collection/popup";
import {
  useLazyFetchUserSigninQuery,
  usePostSignInMutation,
  setTokenCust,
} from "@store/redux-collection/sign-in";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

const ModalAuth = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false); // State untuk menentukan apakah kita di register atau login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("Pria");
  const [birthDate, setBirthDate] = useState({
    day: "01",
    month: "Januari",
    year: "2008",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [postLogin, { isLoading }] = usePostSignInMutation();
  const [fetchUsers, { isFetching: isLoadingUsers }] =
    useLazyFetchUserSigninQuery();
  const { dataCust } = useSelector((state: IRootState) => state.signIn);

  // Handle form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    postLogin({ username: email, password: password })
      .unwrap()
      .then(async (res) => {
        const users = await fetchUsers(res?.data?.access_token).unwrap();
        if (users?.meta?.success) {
          dispatch(
            setTokenCust({
              data: {
                token: res?.data?.access_token,
                userInfo: users?.data,
              },
            })
          );
          onClose();
        } else {
          throw "Terjadi kesalahan saat akses users";
        }
      })
      .catch((err) => {
        dispatch(
          setPopup({
            title: "Gagal",
            type: "danger",
            content: getErrorMessage(err),
            onEnter: (i) => dispatch(clearPopup(i)),
          })
        );
      });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok.");
      return;
    }
    console.log("Daftar:", fullName, gender, birthDate, phoneNumber, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={onClose}
        >
          <HiX size={24} />
        </button>

        {isRegister ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Daftar Sekarang
            </h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  Jenis Kelamin
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="Pria"
                      checked={gender === "Pria"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Pria</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="Wanita"
                      checked={gender === "Wanita"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Wanita</span>
                  </label>
                </div>
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  Tanggal Lahir
                </label>
                <div className="flex space-x-2">
                  <select
                    value={birthDate.day}
                    onChange={(e) =>
                      setBirthDate({ ...birthDate, day: e.target.value })
                    }
                    className="w-1/3 border px-4 py-2 rounded"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {String(i + 1).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthDate.month}
                    onChange={(e) =>
                      setBirthDate({ ...birthDate, month: e.target.value })
                    }
                    className="w-1/3 border px-4 py-2 rounded"
                  >
                    {[
                      "Januari",
                      "Februari",
                      "Maret",
                      "April",
                      "Mei",
                      "Juni",
                      "Juli",
                      "Agustus",
                      "September",
                      "Oktober",
                      "November",
                      "Desember",
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={birthDate.year}
                    onChange={(e) =>
                      setBirthDate({ ...birthDate, year: e.target.value })
                    }
                    className="w-1/3 border px-4 py-2 rounded"
                  >
                    {[...Array(100)].map((_, i) => (
                      <option key={i} value={2023 - i}>
                        {2023 - i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="+62 Nomor Telepon"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Checkbox untuk menyetujui kebijakan */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                  className="form-checkbox"
                  required
                />
                <span className="text-sm text-gray-500">
                  Saya setuju dengan{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Kebijakan Penggunaan CekPremi
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Daftar
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Masuk ke CekPremi
            </h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Username / Email"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {isLoading ? <Spinner className="ml-[10rem] w-6" /> : "Masuk"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-4 text-center">
              <p>
                Belum memiliki akun?{" "}
                <span
                  onClick={() => setIsRegister(true)} // Change to Register
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Daftar Sekarang
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalAuth;
