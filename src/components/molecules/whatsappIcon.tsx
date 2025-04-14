import React from "react";
import { FaWhatsapp } from "react-icons/fa"; // Import FaWhatsapp from react-icons

const WhatsAppIcon = () => {
  const handleClick = () => {
    window.open("https://wa.me/888888888", "_blank");
  };

  return (
    <div
      className="fixed bottom-5 right-2 bg-green-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg cursor-pointer z-50 transition duration-300 hover:bg-green-700"
      onClick={handleClick}
    >
      <FaWhatsapp className="text-white text-xl" />
    </div>
  );
};

export default WhatsAppIcon;
