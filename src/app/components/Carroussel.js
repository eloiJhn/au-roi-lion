'use client';

import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import "swiper/swiper-bundle.min.css";
import Image from 'next/image';

// Register Swiper modules
SwiperCore.use([EffectCoverflow, Pagination, Navigation, Autoplay]);

// Define the gradient for SVG strokes
const svgGradient = (
  <defs>
    <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#003E50" />
      <stop offset="100%" stopColor="#FFD700" />
    </linearGradient>
  </defs>
);

export function Carousel({ images, openModal, modalOpen, closeModal }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [modalIndex, setModalIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const swiperRef = useRef(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Fonction getSlidesPerView sécurisée pour SSR
  function getSlidesPerView() {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  useEffect(() => {
    // Initialiser slidesPerView après le montage du composant
    setSlidesPerView(getSlidesPerView());
    
    const handleResize = debounce(() => setSlidesPerView(getSlidesPerView()), 100);
    window.addEventListener("resize", handleResize);
    
    // Ajouter des écouteurs d'événements de navigation avec clavier pour le carousel principal
    const handleKeyNavigation = (e) => {
      if (modalOpen) return; // Ne pas interférer avec la navigation du modal
      
      if (e.key === 'ArrowLeft') {
        handlePrevClick();
      } else if (e.key === 'ArrowRight') {
        handleNextClick();
      }
    };
    
    window.addEventListener('keydown', handleKeyNavigation);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('keydown', handleKeyNavigation);
    };
  }, []);

  useEffect(() => {
    swiperRef.current?.swiper?.update();
  }, [slidesPerView]);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [modalOpen]);

  // Initialize and update navigation when Swiper instance is ready
  useEffect(() => {
    console.log("[DEBUG] swiperInstance effect triggered", { 
      hasInstance: !!swiperInstance,
      hasNavigation: !!(swiperInstance?.navigation),
    });
    
    if (swiperInstance) {
      if (swiperInstance.navigation) {
        swiperInstance.navigation.init();
        swiperInstance.navigation.update();
      }
      
      // Reconfigurer les éléments de navigation
      console.log("[DEBUG] Reconfiguring navigation", {
        prevElExists: !!navigationPrevRef.current,
        nextElExists: !!navigationNextRef.current,
      });
      
      swiperInstance.params.navigation.prevEl = navigationPrevRef.current;
      swiperInstance.params.navigation.nextEl = navigationNextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
      
      console.log("[DEBUG] Navigation reconfigured");
    }
  }, [swiperInstance]);

  // Gestionnaires de navigation manuels
  const handlePrevClick = () => {
    console.log("[DEBUG] handlePrevClick called", { 
      hasSwiperRef: !!swiperRef.current,
      hasSwiper: !!(swiperRef.current?.swiper),
      isLoop: swiperRef.current?.swiper?.params?.loop,
      activeIndex: swiperRef.current?.swiper?.activeIndex
    });
    
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      
      // Méthode alternative pour naviguer
      const currentIndex = swiper.activeIndex;
      swiper.slideTo(currentIndex - 1);
      
      // Forcer une mise à jour
      setTimeout(() => {
        swiper.update();
        console.log("[DEBUG] After slidePrev with update", { 
          newIndex: swiper.activeIndex 
        });
      }, 10);
    }
  };

  const handleNextClick = () => {
    console.log("[DEBUG] handleNextClick called", { 
      hasSwiperRef: !!swiperRef.current,
      hasSwiper: !!(swiperRef.current?.swiper),
      isLoop: swiperRef.current?.swiper?.params?.loop,
      activeIndex: swiperRef.current?.swiper?.activeIndex
    });
    
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      
      // Méthode alternative pour naviguer
      const currentIndex = swiper.activeIndex;
      swiper.slideTo(currentIndex + 1);
      
      // Forcer une mise à jour
      setTimeout(() => {
        swiper.update();
        console.log("[DEBUG] After slideNext with update", { 
          newIndex: swiper.activeIndex 
        });
      }, 10);
    }
  };

  // Navigation avec clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        handleModalNavigation(-1);
      } else if (e.key === 'ArrowRight') {
        handleModalNavigation(1);
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const handleSlideChange = (swiper) => {
    console.log("[DEBUG] Slide changed to index", swiper.realIndex);
    setActiveIndex(swiper.realIndex);
  };
  
  const handleModalNavigation = (direction) => {
    setModalIndex((prev) => (prev + direction + images.length) % images.length);
  };

  const handleOpenModal = (index) => {
    setModalIndex(index);
    openModal(index);
  };

  const handleUserInteraction = () => {
    setAutoplayEnabled(false);
    if (swiperRef.current?.swiper?.autoplay) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  // Fonction debounce pour limiter les appels fréquents
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 relative" id="photos-section">
      <div className="flex justify-end mb-4">
        <div
          className="fullscreen-icon mr-4 mb-4 sm:mr-2 sm:mb-2 hover:bg-gradient-to-r hover:from-[#003E50] hover:to-[#FFD700] transition-all duration-300 p-2 rounded-full cursor-pointer"
          onClick={() => handleOpenModal(activeIndex)}
        >
          <ArrowsPointingInIcon className="h-6 w-6 text-white" />
        </div>
      </div>

      <Swiper
        ref={swiperRef}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={slidesPerView}
        loop
        spaceBetween={10}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        onSlideChange={handleSlideChange}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        onAutoplayStart={() => setAutoplayEnabled(true)}
        onAutoplayStop={() => setAutoplayEnabled(false)}
        onSwiper={(swiper) => {
          console.log("[DEBUG] onSwiper called", { 
            isSwiper: !!swiper,
            hasNavigation: !!swiper.navigation, 
          });
          
          setSwiperInstance(swiper);
          // S'assurer que les références de navigation sont définies après initialisation
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
          
          // Reconfigurer le comportement de boucle
          swiper.loopDestroy();
          swiper.loopCreate();
          swiper.update();
          
          console.log("[DEBUG] Swiper initialized");
        }}
        pagination={{
          el: '.custom-swiper-pagination',
          clickable: true,
        }}
        navigation={false} // Désactiver la navigation automatique pour utiliser notre propre implémentation
        onTouchStart={handleUserInteraction}
        onReachEnd={() => {
          if (autoplayEnabled && swiperRef.current?.swiper) {
            swiperRef.current.swiper.autoplay.start();
          }
        }}
        className="mySwiper"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              <Image
                src={src}
                alt={`Slide ${index}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className="object-cover cursor-pointer hover:ring-2 hover:ring-[#FFD700]"
                onClick={() => {
                  handleUserInteraction();
                  handleOpenModal(index);
                }}
                style={{ transform: 'translate3d(0, 0, 0)' }}
              />
            </div>
          </SwiperSlide>
        ))}
        <svg width="0" height="0" style={{ position: 'absolute' }}>{svgGradient}</svg>
      </Swiper>
      <div className="custom-swiper-pagination"></div>

      <button 
        ref={navigationPrevRef}
        className="custom-arrow custom-arrow-prev absolute inset-y-0 left-2 my-auto flex items-center justify-center z-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300 transform hover:scale-110 focus:outline-none"
        style={{ height: '40px', width: '40px' }}
        aria-label="Précédent"
        onClick={handlePrevClick}
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg"
        >
          <path 
            d="M15 18L9 12L15 6" 
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button 
        ref={navigationNextRef}
        className="custom-arrow custom-arrow-next absolute inset-y-0 right-2 my-auto flex items-center justify-center z-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300 transform hover:scale-110 focus:outline-none"
        style={{ height: '40px', width: '40px' }}
        aria-label="Suivant"
        onClick={handleNextClick}
        type="button"
      >
         <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg"
        >
          <path 
            d="M9 18L15 12L9 6" 
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {modalOpen && (
        <div
          className="modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="modal-content relative w-full h-full max-w-4xl max-h-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-close absolute top-4 right-4 text-white cursor-pointer z-10 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all duration-300 transform hover:scale-110"
              onClick={closeModal}
              style={{ position: "fixed", width: '40px', height: '40px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full" style={{ position: "fixed", width: '80vw', height: '80vh' }}>
              <Image
                src={images[modalIndex]}
                alt={`Image ${modalIndex}`}
                fill
                sizes="(max-width: 640px) 95vw, 80vw"
                className="object-contain"
                priority
              />
            </div>
            
            <button
              className="custom-arrow custom-arrow-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all duration-300 focus:outline-none z-10 hover:scale-110"
              style={{ position: "fixed", height: '50px', width: '50px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleModalNavigation(-1);
              }}
              aria-label="Image précédente"
              type="button"
            >
              <svg
                width="30" 
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="arrow-svg"
              >
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button
              className="custom-arrow custom-arrow-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all duration-300 focus:outline-none z-10 hover:scale-110"
              style={{ position: "fixed", height: '50px', width: '50px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleModalNavigation(1);
              }}
              aria-label="Image suivante"
              type="button"
            >
              <svg
                width="30" 
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="arrow-svg"
              >
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white text-sm z-10" style={{ position: "fixed" }}>
              {modalIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .custom-arrow:hover .arrow-svg path {
          stroke: url(#arrow-gradient);
          transition: stroke 0.3s ease;
        }
        .fullscreen-icon {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 9999px;
        }
        .fullscreen-icon:hover {
           background-color: rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
}
