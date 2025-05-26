"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { HeaderNavBar } from "./components/HeaderNavBar";
import { Section1 } from "./components/Introduction";
import { Carousel } from "./components/Carroussel";
import { Section3 } from "./components/History";
import { ContactForm } from "./components/ContactForm";
import { Section4 } from "./components/Link";
import { Footer } from "./components/Footer";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { TranslationProvider, TranslationContext } from "./utils/TranslationContext";
import { ThemeProvider } from "./utils/ThemeContext";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "swiper/swiper-bundle.min.css";
import "./page.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const [lastEmailSentTime, setLastEmailSentTime] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [emailQueue, setEmailQueue] = useState([]);
  const autoClickRef = useRef(null);
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
    const timer = setTimeout(() => setShowPriceInfo(false), 6000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
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
        newSlide = 0;
      } else if (newSlide < 0) {
        newSlide = images.length - 1;
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

  const togglePriceInfo = () => {
    setShowPriceInfo((prev) => !prev);
  };

  return (
    <TranslationProvider>
      <ThemeProvider>
        <HomeContent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          showBackToTop={showBackToTop}
          setShowBackToTop={setShowBackToTop}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          initialSlide={initialSlide}
          setInitialSlide={setInitialSlide}
          lastEmailSentTime={lastEmailSentTime}
          setLastEmailSentTime={setLastEmailSentTime}
          isSending={isSending}
          setIsSending={setIsSending}
          emailQueue={emailQueue}
          setEmailQueue={setEmailQueue}
          autoClickRef={autoClickRef}
          showPriceInfo={showPriceInfo}
          setShowPriceInfo={setShowPriceInfo}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
          cursorPosition={cursorPosition}
          images={images}
          openModal={openModal}
          closeModal={closeModal}
          navigateSlide={navigateSlide}
          handleAirbnbClick={handleAirbnbClick}
          handleBookingClick={handleBookingClick}
          togglePriceInfo={togglePriceInfo}
        />
      </ThemeProvider>
    </TranslationProvider>
  );
}

function HomeContent(props) {
  const { messages } = useContext(TranslationContext);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
        nonce: undefined,
      }}
    >
      <div className="min-h-screen">
        <div
          id="custom-cursor"
          style={{
            left: `${props.cursorPosition.x}px`,
            top: `${props.cursorPosition.y}px`,
          }}
        />

        <HeaderNavBar isOpen={props.isOpen} setIsOpen={props.setIsOpen} />

        {isAtTop && (
  <div
    className="floating-icon text-white bg-gradient-to-r from-[#003E50] to-[#5AA088] p-2 rounded-full hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFA500] transition-colors duration-300"
    onClick={props.togglePriceInfo}
  >
    <i className="pi pi-info-circle"></i>
  </div>
        )}

        {props.showPriceInfo && (
          <div className="price-info-box">
            {messages?.HeaderNavBar?.floating_icon_text ||
              "Entre 80 et 120€ la nuit, selon les périodes."}
          </div>
        )}

        <Section1 />
        <Carousel
          images={props.images}
          openModal={props.openModal}
          modalOpen={props.modalOpen}
          closeModal={props.closeModal}
        />
        <Section3 />
        <ContactForm
          lastEmailSentTime={props.lastEmailSentTime}
          setLastEmailSentTime={props.setLastEmailSentTime}
          isSending={props.isSending}
          setIsSending={props.setIsSending}
          emailQueue={props.emailQueue}
          setEmailQueue={props.setEmailQueue}
        />
        <Section4
          handleAirbnbClick={props.handleAirbnbClick}
          handleBookingClick={props.handleBookingClick}
          showBackToTop={props.showBackToTop}
        />
        <Footer />
        <button ref={props.autoClickRef} style={{ display: "none" }} />
      </div>
    </GoogleReCaptchaProvider>
  );
}
