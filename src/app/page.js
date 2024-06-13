"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  KeyIcon,
  SunIcon,
  MoonIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
  ArrowsPointingOutIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const toast = useRef(null);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 1000,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
    ],
  };

  const handleSendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_ijvgm4b",
        "template_wi0dtrj",
        e.target,
        "1D-fmppuB9IBXLMHv"
      )
      .then(
        (result) => {
          console.log("Email sent:", result.text);
          toast.current.show({
            severity: "success",
            summary: "Succès",
            detail: "Message envoyé avec succès!",
            life: 3000,
          });
        },
        (error) => {
          console.log("Failed to send email:", error.text);
          toast.current.show({
            severity: "error",
            summary: "Erreur",
            detail: "Échec de l'envoi du message",
            life: 3000,
          });
        }
      );
  };

  const handleAirbnbClick = () => {
    window.open(
      "https://www.airbnb.fr/rooms/1020299057539782769?source_impression_id=p3_1710485830_Mm8/NF+02HL5BJcH",
      "_blank"
    );
  };

  const handleBookingClick = () => {
    window.open(
      "https://www.booking.com/hotel/fr/au-roi-lion-place-saint-michel.fr.html",
      "_blank"
    );
  };

  const images = [
    "/assets/logo.png",
    "/assets/couloir.jpeg",
    "/assets/salon2.jpeg",
    "/assets/salon3.jpeg",
    "/assets/chambre.jpeg",
    "/assets/salon4.jpeg",
    "/assets/lavabo.jpeg",
    "/assets/salon5.jpeg",
    "/assets/salon.jpeg",
    "/assets/douche.jpeg",
    "/assets/deco.jpeg",
    "/assets/chambre2.jpeg",
    "/assets/chambre3.jpeg",
    "/assets/Untitled.jpeg",
    "/assets/vue.jpeg",
    "/assets/cuisine.jpeg",
    "/assets/cuisine.2jpeg",
    "/assets/chambre4.jpeg",
    "/assets/pancarte.jpeg",
    "/assets/chambre5.jpeg",
  ];

  const nextImage = () => {
    setCurrentImg((prevCurrentImg) => {
      return (prevCurrentImg + 1) % images.length;
    });
  };

  const prevImage = () => {
    setCurrentImg((prevCurrentImg - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 10
    ) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Toast ref={toast} />
      <nav className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img
            src="/assets/logo.png"
            alt="logo site"
            className="w-28 h-28 rounded-full"
          />
          <div className="hidden md:flex space-x-6 text-white font-semibold">
            <a href="#photos-section" className="hover:underline">
              Photos
            </a>
            <a href="#history-section" className="hover:underline">
              Histoire
            </a>
            <a href="#link-section" className="hover:underline">
              Lien
            </a>
            <a href="#contact-form" className="hover:underline">
              Contact
            </a>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4">
            <a
              href="#photos-section"
              className="block p-2 text-gray-700 hover:bg-gray-200"
            >
              Photos
            </a>
            <a
              href="#history-section"
              className="block p-2 text-gray-700 hover:bg-gray-200"
            >
              Histoire
            </a>
            <a
              href="#link-section"
              className="block p-2 text-gray-700 hover:bg-gray-200"
            >
              Lien
            </a>
            <a
              href="#contact-form"
              className="block p-2 text-gray-700 hover:bg-gray-200"
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto mt-10 p-4 text-center md:text-left md:w-full">
        <h1
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Merienda One', cursive",
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "underline",
            textDecorationColor: "#003E50",
          }}
        >
          Au Roi Lion, magnifique appartement de 60 m2 en location dans le
          centre historique de Dijon !
        </h1>
      </div>

      <div
        id="photos-section"
        className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-8 border-double"
        style={{ borderColor: "#003E50 #5AA088" }}
      >
        <p
          className="text-lg font-lora mb-4 text-center"
          style={{
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Tourné vers les amoureux de l'histoire, du patrimoine et des
          passionnés de la gastronomie et du vin, ce logement affiche un style
          résolument unique. En plein coeur de Dijon, cet endroit de charme vous
          séduira par son authenticité, son confort et ses prestations
          raffinées. Chaque pièce invite à la rêverie et aux souvenirs d'antan
          dans ce lieu chargé d'histoire.
        </p>
      </div>

      <div
        className={`mt-4 p-20 flex justify-center items-center relative ${
          isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
        }`}
      >
        <Slider
          {...settings}
          className={isFullscreen ? "w-full h-full" : "w-11/12 mx-auto"}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative ${
                index === currentSlide ? "z-30 p-6" : "z-10 px-6"
              }`} // Add padding to central image and equal margin to non-central images
            >
              <img
                src={image}
                alt={`Slide ${index}`}
                className={`object-cover w-full h-96 md:h-128 lg:h-144 rounded-lg shadow-lg ${
                  index === currentSlide
                    ? "transform scale-125 shadow-2xl brightness-110"
                    : "transform scale-100"
                } transition-transform duration-300`}
              />
            </div>
          ))}
        </Slider>
        <button
          onClick={toggleFullscreen}
          className={`absolute ${
            isFullscreen
              ? "top-4 right-4"
              : "top-1/2 right-2 transform -translate-y-1/2"
          } p-2 text-white bg-black bg-opacity-50 rounded-full z-10`}
        >
          {isFullscreen ? (
            <ArrowsPointingOutIcon className="h-6 w-6" />
          ) : (
            <ArrowsPointingOutIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        id="history-section"
        className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-8 border-double"
        style={{ borderColor: "#003E50 #5AA088" }}
      >
        <div className="p-4">
          <p
            className="text-lg font-lora mb-4"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sa majesté vous invite à contempler l'église Saint Michel du XVIe
            siècle, célèbre par sa façade Renaissance et considérée comme l'une
            des plus belles de France, classée monument historique. Plongez dans
            une expérience unique où le confort moderne se conjugue au charme de
            l'ancien dans notre logement soigneusement décoré qui vous
            transporte dans un monde inspiré par la majesté et le raffiné.
            Chaque pièce invite à la rêverie et aux souvenirs d'antan dans ce
            lieu chargé d'histoire.
          </p>
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <KeyIcon className="h-6 w-6 text-gray-700" />
              <p
                className="text-gray-600 text-lg font-lora"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Dès que vous franchissez la porte, vous êtes accueilli par des
                touches de décoration élégantes intégrées à un magnifique
                appartement du 17ème siècle.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <InformationCircleIcon className="h-6 w-6 text-gray-700" />
              <p
                className="text-gray-600 text-lg font-lora"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                La cuisine moderne, toute équipée, vous permettra de concocter
                des spécialités dijonnaises et de découvrir les meilleurs vins
                de la région et des crémants de Bourgogne.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <SunIcon className="h-6 w-6 text-gray-700" />
              <p
                className="text-gray-600 text-lg font-lora"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Un superbe salon du 17ème, lumineux et chaleureux, vous attend
                pour vous laisser aller à la rêverie et au repos.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <MoonIcon className="h-6 w-6 text-gray-700" />
              <p
                className="text-gray-600 text-lg font-lora"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                La chambre avec un grand lit double ainsi qu'un vaste dressing
                et sa salle de bain attenante équipée d'une grande douche à
                l'italienne, sauront vous replonger dans le monde féérique du
                XVIIe siècle.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
              <p
                className="text-gray-600 text-lg font-lora"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Idéalement situé en plein cœur historique de Dijon, "Au Roi
                Lion" offre un accès facile aux boutiques et commerces locaux
                tout en étant un refuge paisible après une journée d'exploration
                et de visites.
              </p>
            </div>
          </div>
          <p
            className="mt-8 text-gray-600 text-lg font-semibold font-lora"
            style={{
              background: "linear-gradient(to right, #003E50, #5AA088)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Réservez dès maintenant et vivez une expérience locative qui
            éveillera vos sens et émerveillera votre esprit. "Au Roi Lion" est
            bien plus qu'un logement, c'est une aventure mémorable, un voyage au
            cœur de la cité historique Dijonnaise.
          </p>
        </div>
      </div>

      <div id="contact-form" className="mt-20 p-8 mx-auto max-w-4xl">
      <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{
            fontFamily: "'Merienda One', cursive",
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "underline",
            textDecorationColor: "#003E50",
          }}
        >
          Contactez le Propriétaire
        </h1>
        <form onSubmit={handleSendEmail} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="from_name"
              className="text-sm font-medium"
              style={{
                background: "linear-gradient(to right, #003E50, #5AA088)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Votre Nom:
            </label>
            <input
              type="text"
              name="from_name"
              id="from_name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="reply_to"
              className="text-sm font-medium"
              style={{
                background: "linear-gradient(to right, #003E50, #5AA088)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Votre Email:
            </label>
            <input
              type="email"
              name="reply_to"
              id="reply_to"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="text-sm font-medium"
              style={{
                background: "linear-gradient(to right, #003E50, #5AA088)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Message:
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 border text-base font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: "linear-gradient(to right, #003E50, #5AA088)",
                border: "none",
                color: "white",
                padding: "1px" /* Inner padding to show border */,
              }}
            >
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                  borderRadius: "inherit",
                  padding:
                    "10px 24px" /* Adjust according to the padding of the button */,
                  color: "white",
                }}
              >
                Envoyer
              </span>
            </button>
          </div>
        </form>
      </div>
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
          « Location également disponible sur airbnb ou booking »
        </h1>
      </div>

      <div className="relative flex justify-center items-center mt-10 p-8">
        <div
          className="cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105"
          onClick={handleAirbnbClick}
        >
          <img
            src="/assets/airbnb_logo.jpeg"
            alt="Airbnb Logo"
            className="w-40 h-40 object-contain"
          />
        </div>
        <div
          className="cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 ml-10 relative"
          onClick={handleBookingClick}
        >
          <img
            src="/assets/booking_logo.png"
            alt="Booking Logo"
            className="w-40 h-40 object-contain"
          />
        </div>
        {showBackToTop && (
          <div
            className={`absolute top-1/2 right-8 transform -translate-y-1/2 transform transition-opacity duration-500 ${
              showBackToTop ? "opacity-100" : "opacity-0"
            }`}
          >
            <a href="#top">
              <div
                className="h-12 w-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(to right, #003E50, #5AA088)",
                }}
              >
                <ChevronUpIcon className="h-5 w-5 text-white" />
              </div>
            </a>
          </div>
        )}
      </div>

      <footer className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-8 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
            <p className="text-lg font-semibold">Coordonnées de contact :</p>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:severine.jahan@free.fr" className="underline">
                severine.jahan@free.fr
              </a>
            </p>
            <p className="text-sm">
              Tel:{" "}
              <a href="tel:076100601" className="underline">
                076100601
              </a>
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end space-x-6">
            <a
              href="#photos-section"
              className="text-gray-200 hover:text-white"
            >
              Photos
            </a>
            <a
              href="#history-section"
              className="text-gray-200 hover:text-white"
            >
              Histoire
            </a>
            <a href="#link-section" className="text-gray-200 hover:text-white">
              Lien
            </a>
            <a href="#contact-form" className="text-gray-200 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
