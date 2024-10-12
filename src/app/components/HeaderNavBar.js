import React, { useState, useRef, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { TranslationContext } from "../utils/TranslationContext";

export function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isActivated, setIsActivated] = useState(false); // Pour le mode mobile
  const [isDesktopActivated, setIsDesktopActivated] = useState(false); // Nouvel état pour le mode desktop
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);
  const fadeOutTimerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, messages, switchLanguage } =
    useContext(TranslationContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajustez le breakpoint si nécessaire
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Initialiser la valeur
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const startMusic = () => {
    if (audioRef.current) {
      clearInterval(fadeOutTimerRef.current);
      audioRef.current.volume = 0.5;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio started successfully.");
          })
          .catch((error) => {
            console.error("Audio play failed:", error);
          });
      }
    }
  };

  
  const stopMusic = () => {
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
          
          // Mettre en pause l'audio et réinitialiser son état
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = '';  // Vider la source audio pour forcer l'arrêt dans le lecteur système
          
          console.log("Audio stopped and source cleared.");
          
          // Utilisation de getAudioTracks() pour arrêter les pistes audio dans le système
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then((mediaStream) => {
              const tracks = mediaStream.getAudioTracks();
              tracks.forEach(track => track.stop());  // Arrêter chaque piste audio
              console.log("All audio tracks stopped.");
            })
            .catch((error) => {
              console.error("Error stopping audio tracks:", error);
            });
        }
      }, intervalDuration);
    }
  };
  
  
  
  

  const handleLogoClick = (event) => {
    event.stopPropagation();

    if (isMobile) {
      if (isActivated) {
        stopMusic();
        setIsActivated(false);
      } else {
        startMusic();
        setIsActivated(true);
      }
    } else {
      if (!isDesktopActivated) {
        setIsDesktopActivated(true);
        setIsHovering(true);
        startMusic();
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && isDesktopActivated) {
      setIsHovering(true);
      startMusic();
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && isDesktopActivated) {
      setIsHovering(false);
      stopMusic();
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

  const navItems = [
    {
      href: "#photos-section",
      label: messages.HeaderNavBar?.photos || "Photos",
    },
    {
      href: "#history-section",
      label: messages.HeaderNavBar?.history || "Histoire",
    },
    { href: "#link-section", label: messages.HeaderNavBar?.links || "Liens" },
    {
      href: "#contact-form",
      label: messages.HeaderNavBar?.contact || "Contact",
    },
  ];

  const shouldAnimate = isMobile ? isActivated : isDesktopActivated && isHovering;

  return (
    <nav className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="logo-container relative w-28 h-28 group cursor-pointer"
          onClick={handleLogoClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 ${
              shouldAnimate ? "rotate-360" : ""
            }`}
          >
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
        </div>
        <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:underline transition duration-300 ease-in-out hover:text-[#FFD700] text-lg tracking-wide uppercase"
              style={{ letterSpacing: "1.5px" }}
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
              style={{ letterSpacing: "1.5px" }}
              onClick={toggleMenu}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
      <audio ref={audioRef} loop>
        <source src="/lion.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'élément audio.
      </audio>
      <style jsx>{`
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
