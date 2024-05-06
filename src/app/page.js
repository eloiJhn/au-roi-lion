"use client";

import Head from "next/head";
import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  KeyIcon,
  SunIcon,
  MoonIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(true);
  const toast = useRef(null);

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
    setCurrentImg((prevCurrentImg) => {
      return (prevCurrentImg - 1 + images.length) % images.length;
    });
  };

  return (
    <div className="min-h-screen">
      <Toast ref={toast} />
      <nav className="bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <img
            src="/assets/logo.png"
            alt="logo site"
            className="w-20 h-20 rounded-full"
          ></img>
          <div className="hidden md:flex space-x-4 text-white">
            <a href="#photos">Photos</a>
            <a href="#histoire">Histoire</a>
            <a href="#lien">Lien</a>
            <a href="#contact">Contact</a>
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
          <div className="md:hidden absolute top-18 right-2 bg-white shadow-lg rounded-lg p-2">
            <a href="#photos" className="block p-2 text-gray-500">
              Photos
            </a>
            <a href="#histoire" className="block p-2 text-gray-500">
              Histoire
            </a>
            <a href="#lien" className="block p-2 text-gray-500">
              Lien
            </a>
            <a href="#contact" className="block p-2 text-gray-500">
              Contact
            </a>
          </div>
        )}
      </nav>
      {isOpen && (
        <div className="md:hidden absolute top-18 right-2 bg-white shadow-lg rounded-lg p-2">
          <a href="#photos" className="block p-2 text-gray-500">
            Photos
          </a>
          <a href="#histoire" className="block p-2 text-gray-500">
            Histoire
          </a>
          <a href="#lien" className="block p-2 text-gray-500">
            Lien
          </a>
          <a href="#contact" className="block p-2 text-gray-500">
            Contact
          </a>
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-10 p-4 text-center md:text-left md:w-full">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Merienda One', cursive", color: "#333" }}
        >
          Au Roi Lion, magnifique appartement de 60 m2 en location dans le
          centre historique de Dijon !
        </h1>
      </div>
      <div
        className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-5 border-double"
        style={{ borderColor: "#003E50 #5AA088" }}
      >
        <p className="text-xl text-center text-gray-700">
          Tourné vers les amoureux de l'histoire, du patrimoine et des
          passionnés de la gastronomie et du vin, ce logement affiche un style
          résolument unique. En plein coeur de Dijon, cet endroit de charme vous
          séduira par son authenticité, son confort et ses prestations
          raffinées. Chaque pièce invite à la rêverie et aux souvenirs d'antan
          dans ce lieu chargé d'histoire.
        </p>
      </div>

      <div className="mt-4 p-60 flex justify-center items-center relative">
        <button
          onClick={prevImage}
          className="absolute left-10 p-2 text-white bg-black bg-opacity-50 rounded-full z-10"
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
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <img
          src={images[currentImg]}
          className={`relative object-cover object-center w-100 h-80 rounded-lg shadow-lg transition duration-300 ease-in-out transform ${
            isZoomed ? "scale-200" : ""
          }`}
          alt="image du carousel"
        />
        <button
          onClick={nextImage}
          className="absolute right-10 p-2 text-white bg-black bg-opacity-50 rounded-full z-10"
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
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
      <div className="p-8">
        <p className="text-lg font-lora text-gray-600 mb-4">
          Sa majesté vous invite à contempler l'église Saint Michel du XVIe
          siècle, célèbre par sa façade Renaissance et considérée comme l'une
          des plus belles de France, classée monument historique. Plongez dans
          une expérience unique où le confort moderne se conjugue au charme de
          l'ancien dans notre logement soigneusement décoré qui vous transporte
          dans un monde inspiré par la majesté et le raffiné. Chaque pièce
          invite à la rêverie et aux souvenirs d'antan dans ce lieu chargé
          d'histoire.
        </p>
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <KeyIcon className="h-6 w-6 text-gray-700" />
            <p className="text-gray-600 text-lg font-lora">
              Dès que vous franchissez la porte, vous êtes accueilli par des
              touches de décoration élégantes intégrées à un magnifique
              appartement du 17ème siècle.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <InformationCircleIcon className="h-6 w-6 text-gray-700" />
            <p className="text-gray-600 text-lg font-lora">
              La cuisine moderne, toute équipée, vous permettra de concocter des
              spécialités dijonnaises et de découvrir les meilleurs vins de la
              région et des crémants de Bourgogne.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SunIcon className="h-6 w-6 text-gray-700" />
            <p className="text-gray-600 text-lg font-lora">
              Un superbe salon du 17ème, lumineux et chaleureux, vous attend
              pour vous laisser aller à la rêverie et au repos.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <MoonIcon className="h-6 w-6 text-gray-700" />
            <p className="text-gray-600 text-lg font-lora">
              La chambre avec un grand lit double ainsi qu'un vaste dressing et
              sa salle de bain attenante équipée d'une grande douche à
              l'italienne, sauront vous replonger dans le monde féérique du
              XVIIe siècle.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
            <p className="text-gray-600 text-lg font-lora">
              Idéalement situé en plein cœur historique de Dijon, "Au Roi Lion"
              offre un accès facile aux boutiques et commerces locaux tout en
              étant un refuge paisible après une journée d'exploration et de
              visites.
            </p>
          </div>
        </div>
        <p className="mt-8 text-gray-600 text-lg font-semibold font-lora">
          Réservez dès maintenant et vivez une expérience locative qui éveillera
          vos sens et émerveillera votre esprit. "Au Roi Lion" est bien plus
          qu'un logement, c'est une aventure mémorable, un voyage au cœur de la
          cité historique Dijonnaise.
        </p>
      </div>
      <div className="p-8 mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Contactez le Propriétaire
        </h2>
        <form onSubmit={handleSendEmail} className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="from_name"
              className="text-sm font-medium text-gray-700"
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
              className="text-sm font-medium text-gray-700"
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
              className="text-sm font-medium text-gray-700"
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
              className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
      <div className="text-center mt-10">
        <p className="text-lg font-bold italic">
          « possibilité de louer en direct sur Airbnb ou Booking »
        </p>
      </div>
      <div className="flex justify-center items-center mt-10 space-x-10 p-6 ">
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
          className="cursor-pointer rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105"
          onClick={handleBookingClick}
        >
          <img
            src="/assets/booking_logo.png"
            alt="Booking Logo"
            className="w-40 h-40 object-contain"
          />
        </div>
      </div>
      <footer className="bg-gray-800 text-white">
  <div className="max-w-6xl mx-auto py-8 px-4 md:flex md:justify-between md:items-center">
    <div className="md:w-1/2">
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
    <div className="md:w-1/2 mt-4 md:mt-0 flex justify-center md:justify-end">
      <div className="flex space-x-4">
        <a href="#photos" className="text-gray-300 hover:text-white">
          Photos
        </a>
        <a href="#histoire" className="text-gray-300 hover:text-white">
          Histoire
        </a>
        <a href="#lien" className="text-gray-300 hover:text-white">
          Lien
        </a>
        <a href="#contact" className="text-gray-300 hover:text-white">
          Contact
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}
