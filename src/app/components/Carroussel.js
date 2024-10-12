import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectCoverflow, Pagination, Navigation } from "swiper";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";
import "swiper/swiper-bundle.min.css";

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

export function Carousel({
  images,
  openModal,
  modalOpen,
  closeModal,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [modalIndex, setModalIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Scroll to the carousel when the component mounts
    const carousel = document.getElementById('photos-section');
    if (carousel) {
      carousel.scrollIntoView({ behavior: 'smooth' });
    }

    // Prevent default anchor link behavior
    const handleClick = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener('click', handleClick);
    }
  }, []);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [slidesPerView]);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const handleSwiper = (swiper) => {
    setSwiper(swiper);
  };

  const handleModalNavigation = (direction) => {
    setModalIndex((prevIndex) => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) {
        newIndex = images.length - 1;
      } else if (newIndex >= images.length) {
        newIndex = 0;
      }
      return newIndex;
    });
  };

  const handleOpenModal = (index) => {
    setModalIndex(index);
    openModal(index);
  };

  return (
    <div id="photos-section" className="max-w-6xl mx-auto mt-20 relative">
      <div className="flex justify-end mb-4">
        <div
          className="fullscreen-icon"
          onClick={() => handleOpenModal(activeIndex)}
        >
          <ArrowsPointingInIcon className="h-6 w-6 text-white" />
        </div>
      </div>
      <Swiper
        ref={swiperRef}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        loop={true}
        spaceBetween={10}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="mySwiper"
        onSlideChange={handleSlideChange}
        onSwiper={handleSwiper}
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center w-10 h-64 m-0 p-0 relative"
          >
            <img
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-96 object-cover cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(index);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-swiper-pagination"></div>
      <div className="absolute inset-y-0 left-2 custom-swiper-button-prev flex items-center">
        <div className="swiper-button-prev"></div>
      </div>
      <div className="absolute inset-y-0 right-2 custom-swiper-button-next flex items-center">
        <div className="swiper-button-next"></div>
      </div>

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
              className="modal-close absolute top-4 right-4 text-white text-2xl cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </div>
            <div className="flex w-full h-full">
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalNavigation(-1);
                }}
              />
              <div
                className="w-1/2 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleModalNavigation(1);
                }}
              />
            </div>
            <img
              src={images[modalIndex]}
              alt={`Image ${modalIndex}`}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full object-contain"
            />
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleModalNavigation(-1);
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="url(#gradient-left)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="gradient-left"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#003E50" />
                    <stop offset="100%" stopColor="#5AA088" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleModalNavigation(1);
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="url(#gradient-right)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="gradient-right"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#003E50" />
                    <stop offset="100%" stopColor="#5AA088" />
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}