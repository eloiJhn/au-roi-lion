import React, { useState, useRef, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { TranslationContext } from "../utils/TranslationContext";
import ReactCountryFlag from "react-country-flag";


export function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isActivated, setIsActivated] = useState(false); 
  const [isDesktopActivated, setIsDesktopActivated] = useState(false); 
  const [isMobile, setIsMobile] = useState(false);

  const pausedAtRef = useRef(0);
  const startTimeRef = useRef(0);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const audioBufferRef = useRef(null);
  const audioRef = useRef(null); 
  const fadeOutTimerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, messages, switchLanguage } = useContext(TranslationContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); 
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);
  

  const playMusicWithWebAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.AudioContext)();
  
      try {
        const response = await fetch("/lion.mp3");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBufferRef.current = audioBuffer;
      } catch (error) {
        console.error("Erreur de lecture avec l'API Web Audio :", error);
        return;
      }
    }
  
    if (audioContextRef.current && audioBufferRef.current) {
      audioSourceRef.current = audioContextRef.current.createBufferSource();
      audioSourceRef.current.buffer = audioBufferRef.current;
      audioSourceRef.current.connect(audioContextRef.current.destination);
  
      const offset = pausedAtRef.current || 0;
      audioSourceRef.current.start(0, offset);
      startTimeRef.current = audioContextRef.current.currentTime - offset;
      setIsActivated(true);
  
      audioSourceRef.current.onended = () => {
        pausedAtRef.current = 0;
        setIsActivated(false);
      };
    }
  };

  const stopMusicWithWebAudio = () => {
    if (audioSourceRef.current && audioContextRef.current) {
      audioSourceRef.current.stop();
      const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current;
      pausedAtRef.current = elapsedTime;
      audioSourceRef.current = null;
      setIsActivated(false);
    }
  };

  const startMusicDesktop = () => {
    if (audioRef.current) {
      clearInterval(fadeOutTimerRef.current);
      audioRef.current.volume = 0.5;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
          })
          .catch((error) => {
          });
      }
    }
  };

  const stopMusicDesktop = () => {
    if (audioRef.current && !audioRef.current.paused) {
      const fadeOutDuration = 1000;
      const intervalDuration = 50;
      const steps = fadeOutDuration / intervalDuration;
      const volumeStep = audioRef.current.volume / steps;

      fadeOutTimerRef.current = setInterval(() => {
        if (audioRef.current.volume > volumeStep) {
          audioRef.current.volume -= volumeStep;
        } else {
          clearInterval(fadeOutTimerRef.current);
          audioRef.current.pause();
        }
      }, intervalDuration);
    }
  };

  const handleLogoClick = (event) => {
    event.stopPropagation();

    if (isMobile) {
      if (isActivated) {
        stopMusicWithWebAudio();
      } else {
        playMusicWithWebAudio();
      }
    } else {
      if (!isDesktopActivated) {
        setIsDesktopActivated(true);
        setIsHovering(true);
        startMusicDesktop();
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && isDesktopActivated) {
      setIsHovering(true);
      startMusicDesktop();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isDesktopActivated) {
      setIsHovering(false);
      stopMusicDesktop();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;

      audioRef.current.onended = () => {
        audioRef.current.currentTime = 0;
        setIsDesktopActivated(false);
        setIsHovering(false);
      };
    }
    return () => {
      clearInterval(fadeOutTimerRef.current);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
  
    const targetId = e.target.getAttribute("href").slice(1);
  
    if (isMobile && targetId === "photos-section") {
      const targetSlide = document.querySelector('[data-swiper-slide-index="2"]');
      if (targetSlide) {
        const slidePosition = targetSlide.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: slidePosition,
          behavior: "smooth"
        });
      }
    } else {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };
  
  
  const navItems = [
    { href: "#photos-section", label: messages.HeaderNavBar?.photos || "Photos" },
    { href: "#history-section", label: messages.HeaderNavBar?.history || "Histoire" },
    { href: "#link-section", label: messages.HeaderNavBar?.links || "Liens" },
    { href: "#contact-form", label: messages.HeaderNavBar?.contact || "Contact" },
  ];

  const shouldAnimate = isMobile ? isActivated : isDesktopActivated && isHovering;

  return (
<nav className="navbar-mobile bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
<div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="logo-container relative w-28 h-28 group cursor-pointer"
          onClick={handleLogoClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`absolute inset-0 transition-transform duration-500 ${shouldAnimate ? "rotate-360" : ""}`}>
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-full h-full rounded-full transition-transform duration-500 ease-out"
              style={{ transform: shouldAnimate ? "rotate(360deg)" : "rotate(0deg)" }}
            />
            {shouldAnimate &&
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute transition-opacity duration-300 opacity-100"
                  style={{
                    animation: "notes 2s infinite linear",
                    animationDelay: `${i * 0.5}s`,
                    fontSize: "24px",
                    top: ["45%", "25%", "75%", "55%"][i],
                    left: ["20%", "40%", "60%", "80%"][i],
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Music
                    size={34}
                    style={{
                      color: "white",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  />
                </div>
              ))}
          </div>
          <audio ref={audioRef} src="/lion.mp3" preload="auto" />
        </div>

        <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:underline transition duration-300 ease-in-out hover:text-[#FFD700] text-lg tracking-wide uppercase"
              onClick={handleClick}
            >
              {item.label}
            </a>
          ))}
          <button
            className="text-white ml-4 py-2 px-4 rounded-lg border border-white hover:bg-[#FFD700] hover:text-[#003E50] transition duration-300 ease-in-out"
            onClick={switchLanguage}
          >
            {currentLocale === "fr" ? (
              <ReactCountryFlag countryCode="FR" svg style={{ width: '24px', height: '24px' }} title="Français" />
            ) : (
              <ReactCountryFlag countryCode="GB" svg style={{ width: '24px', height: '24px' }} title="English" />
            )}
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button
            className="text-white focus:outline-none mr-4"
            onClick={toggleMenu}
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
          <button
            className="text-white py-2 px-4 rounded-lg border border-white hover:bg-[#FFD700] hover:text-[#003E50] transition duration-300 ease-in-out"
            onClick={switchLanguage}
          >
            {currentLocale === "fr" ? (
              <ReactCountryFlag countryCode="FR" svg style={{ width: '24px', height: '24px' }} title="Français" />
            ) : (
              <ReactCountryFlag countryCode="GB" svg style={{ width: '24px', height: '24px' }} title="English" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
  <div className="md:hidden mt-4 mobile-menu" style={{ position: 'relative', zIndex: 20 }}>
          <div className="flex flex-col space-y-4 text-white font-semibold">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:underline transition duration-300 ease-in-out hover:text-[#FFD700] text-lg tracking-wide uppercase"
                onClick={handleClick}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <audio ref={audioRef} loop>
        <source src="/lion.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <style>{`
        @keyframes rotate360 {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .rotate-360 {
          animation: rotate360 2s linear infinite;
        }
        .logo-container img {
          transition: transform 0.5s ease-out;
        }
        @keyframes notes {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.3);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
}
