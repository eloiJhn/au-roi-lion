"use client";

import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { ArrowsPointingInIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { HeaderNavBar } from "./components/HeaderNavBar";
import { Section1 } from "./components/Section1";
import { Carousel } from "./components/Carroussel";
import { Section3 } from "./components/Section3";
import { ContactForm } from "./components/ContactForm";
import { Section4 } from "./components/Section4";
import { Footer } from "./components/Footer";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { TranslationProvider } from "./utils/TranslationContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "swiper/swiper-bundle.min.css";
import "./page.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [lastEmailSentTime, setLastEmailSentTime] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [emailQueue, setEmailQueue] = useState([]);
  const toast = useRef(null);
  const autoClickRef = useRef(null);

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
    "/assets/chambre4.jpeg",
    "/assets/pancarte.jpeg",
    "/assets/chambre5.jpeg",
  ];

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

  const openModal = (index) => {
    setInitialSlide(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const navigateSlide = (direction) => {
    setInitialSlide((prevSlide) => {
      let newSlide = prevSlide + direction;
      if (newSlide >= images.length) {
        newSlide = 0; // Revient à la première image
      } else if (newSlide < 0) {
        newSlide = images.length - 1; // Va à la dernière image
      }
      return newSlide;
    });
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

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <TranslationProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: 'head',
          nonce: undefined,
        }}
      >
        <div className="min-h-screen">
          <div
            id="custom-cursor"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
            }}
          />

          <HeaderNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
          <Section1 />
          <Carousel
            images={images}
            openModal={openModal}
            modalOpen={modalOpen}
            closeModal={closeModal}
            initialSlide={initialSlide}
            navigateSlide={navigateSlide}
          />
          <Section3 />
          <ContactForm
            lastEmailSentTime={lastEmailSentTime}
            setLastEmailSentTime={setLastEmailSentTime}
            isSending={isSending}
            setIsSending={setIsSending}
            emailQueue={emailQueue}
            setEmailQueue={setEmailQueue}
          />
          <Section4
            handleAirbnbClick={handleAirbnbClick}
            handleBookingClick={handleBookingClick}
            showBackToTop={showBackToTop}
          />
          <Footer />
          <button ref={autoClickRef} style={{ display: 'none' }} />
        </div>
      </GoogleReCaptchaProvider>
    </TranslationProvider>
  );
}