import React, {useContext} from 'react';
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { TranslationContext } from "../utils/TranslationContext";

export function Section4({ handleAirbnbClick, handleBookingClick, showBackToTop }) {
  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  };
  
  const { currentLocale, messages } = useContext(TranslationContext);

  return (
    <div id="link-section">
      <div className="text-center mt-10">
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Merienda One', cursive",
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "underline",
            textDecorationColor: "#003E50",
          }}
        >
          {messages.Section4?.title || "Location également disponible sur airbnb ou booking"}
        </h1>
      </div>

      <div className="relative flex justify-center items-center mt-10 p-8 flex-wrap gap-8">
        <div
          className="cursor-pointer rounded-3xl overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
          onClick={handleAirbnbClick}
        >
          <img
            src="/assets/airbnb_logo.jpeg"
            alt="Airbnb Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover"
          />
        </div>
        <div
          className="cursor-pointer rounded-3xl overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r from-[#FFD700] to-[#FFA500]"
          onClick={handleBookingClick}
        >
          <img
            src="/assets/booking_logo.png"
            alt="Booking Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-cover"
          />
        </div>
        {showBackToTop && (
          <div
          className={`absolute top-1/2 right-4 md:right-11 transform -translate-y-1/2 transition-opacity duration-500 ${
            showBackToTop ? "opacity-100" : "opacity-0"
          }`}
        >
          <button onClick={handleBackToTop}>
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center shadow-md bg-gradient-to-r from-[#003E50] to-[#5AA088] hover:bg-gradient-to-r hover:from-[#003E50] hover:to-[#FFD700] transition-all duration-300 hover:shadow-lg"
            >
              <ChevronUpIcon className="h-6 w-6 text-white" />
            </div>
          </button>
        </div>
        )}
      </div>
    </div>
  );
}