import React, { useState, useRef, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { TranslationContext } from "../utils/TranslationContext";

export function HeaderNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isActivated, setIsActivated] = useState(false); // Pour le mode mobile
  const [isMobile, setIsMobile] = useState(false);
  const audioContextRef = useRef(null);
  const audioSourceRef = useRef(null);
  const fadeOutTimerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, messages, switchLanguage } =
    useContext(TranslationContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajuster le breakpoint si nécessaire
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

  const playMusicWithWebAudio = async () => {
    if (!audioContextRef.current) {
      // Créer un nouveau contexte audio
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

      try {
        // Charger le fichier audio
        const response = await fetch("/lion.mp3"); // Remplacer par le chemin du fichier audio
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

        // Créer une source audio
        audioSourceRef.current = audioContextRef.current.createBufferSource();
        audioSourceRef.current.buffer = audioBuffer;
        audioSourceRef.current.connect(audioContextRef.current.destination);

        // Jouer l'audio
        audioSourceRef.current.start(0);
        setIsActivated(true);

        // Stopper automatiquement la musique quand elle se termine
        audioSourceRef.current.onended = () => {
          stopMusicWithWebAudio();
        };

      } catch (error) {
        console.error("Erreur lors de la lecture audio avec l'API Web Audio :", error);
      }
    }
  };

  const stopMusicWithWebAudio = () => {
    if (audioSourceRef.current && audioContextRef.current) {
      audioSourceRef.current.stop();
      audioContextRef.current.close();  // Fermer le contexte audio
      audioSourceRef.current = null;
      audioContextRef.current = null;
      setIsActivated(false);
      console.log("Musique arrêtée via l'API Web Audio.");
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
    }
  };

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

  const shouldAnimate = isMobile && isActivated;

  return (
    <nav className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div
          className="logo-container relative w-28 h-28 group cursor-pointer"
          onClick={handleLogoClick}
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
