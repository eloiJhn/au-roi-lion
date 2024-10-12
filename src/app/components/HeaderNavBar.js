import React, { useState, useRef, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { TranslationContext } from "../utils/TranslationContext";

export function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const audioRef = useRef(null);
  const fadeOutTimerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, messages, switchLanguage } = useContext(TranslationContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClick = () => {
    if (!isActivated) {
      setIsActivated(true);
      setIsHovering(true);
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  };

  const handleMouseEnter = () => {
    if (isActivated) {
      setIsHovering(true);
      if (audioRef.current) {
        clearInterval(fadeOutTimerRef.current);
        if (audioRef.current.paused) {
          audioRef.current.play().catch((error) => {
            console.error("Audio playback failed:", error);
          });
        } else {
          audioRef.current.volume = 0.5;
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (isActivated) {
      setIsHovering(false);
      if (audioRef.current) {
        const fadeOutDuration = 1000;
        const intervalDuration = 50;
        const steps = fadeOutDuration / intervalDuration;
        const volumeStep = audioRef.current.volume / steps;

        fadeOutTimerRef.current = setInterval(() => {
          if (audioRef.current.volume > volumeStep) {
            audioRef.current.volume -= volumeStep;
          } else {
            audioRef.current.pause();
            audioRef.current.volume = 0.5;
            clearInterval(fadeOutTimerRef.current);
          }
        }, intervalDuration);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
    return () => {
      clearInterval(fadeOutTimerRef.current);
    };
  }, []);

  // Gestion des éléments de navigation traduits
  const navItems = [
    { href: "#photos-section", label: messages.HeaderNavBar?.photos || "Photos" },
    { href: "#history-section", label: messages.HeaderNavBar?.history || "Histoire" },
    { href: "#link-section", label: messages.HeaderNavBar?.links || "Liens" },
    { href: "#contact-form", label: messages.HeaderNavBar?.contact || "Contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="relative w-28 h-28 group cursor-pointer"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 ${
              isActivated && isHovering ? "group-hover:rotate-360" : ""
            }`}
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-full h-full rounded-full"
            />
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`absolute transition-opacity duration-300 ${
                  isActivated && isHovering ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  animation: `notes 2s infinite linear`,
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
                    visibility:
                      isActivated && isHovering ? "visible" : "hidden",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:underline transition duration-300 ease-in-out hover:text-[#FFD700] text-lg tracking-wide uppercase"
              style={{ letterSpacing: '1.5px' }}
            >
              {item.label}
            </a>
          ))}
          <button
            className="text-white ml-4 py-2 px-4 rounded-lg border border-white hover:bg-[#FFD700] hover:text-[#003E50] transition duration-300 ease-in-out flex items-center"
            onClick={switchLanguage}
          >
            {currentLocale === "fr" ? (
              <span className="flex items-center">🇫🇷 Français</span>
            ) : (
              <span className="flex items-center">🇬🇧 English</span>
            )}
          </button>
        </div>
        <div className="flex items-center md:hidden">
          <button
            className="text-white focus:outline-none mr-4"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <button
            className="text-white py-2 px-2 rounded-lg border border-white hover:bg-[#FFD700] hover:text-[#003E50] transition duration-300 ease-in-out flex items-center"
            onClick={switchLanguage}
          >
            {currentLocale === "fr" ? (
              <span className="flex items-center">🇫🇷</span>
            ) : (
              <span className="flex items-center">🇬🇧</span>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 px-4 text-white hover:bg-[#004d63] transition duration-300 ease-in-out hover:text-[#FFD700] tracking-wide uppercase"
              style={{ letterSpacing: '1.5px' }}
              onClick={toggleMenu}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
      <audio ref={audioRef} loop>
        <source src="/lion.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <style jsx>{`
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