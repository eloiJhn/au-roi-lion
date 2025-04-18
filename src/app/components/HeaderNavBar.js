import React, { useState, useEffect, useContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Music } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { TranslationContext } from "../utils/TranslationContext";
import ReactCountryFlag from "react-country-flag";
import { AudioPlayer } from "./AudioPlayer";

export function HeaderNavBar() {  
  // États
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, messages, switchLanguage } = useContext(TranslationContext);

  // Fonction pour indiquer que la musique est en cours de lecture
  const onMusicStatusChange = (isPlaying) => {
    setMusicPlaying(isPlaying);
  };

  // Fonction pour basculer l'affichage du menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Détection du format mobile via le redimensionnement
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
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

  // Navitems pour les liens de navigation
  const navItems = [
    { href: "#photos-section", label: messages.HeaderNavBar?.photos || "Photos" },
    { href: "#history-section", label: messages.HeaderNavBar?.history || "History" },
    { href: "#link-section", label: messages.HeaderNavBar?.links || "Links" },
    { href: "#contact-form", label: messages.HeaderNavBar?.contact || "Contact" },
  ];

  // Gestion du clic sur un lien avec défilement fluide
  const handleClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const navbarHeight = 70; // Hauteur approximative de la navbar
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop;
        window.scrollTo({
          top: targetTop - navbarHeight,
          behavior: "smooth",
        });
        // Ferme le menu mobile après clic
        setIsOpen(false);
      }
    }
  };
  
  const handleLanguageSwitch = (locale) => {
    switchLanguage(locale);
  };

  return (
    <nav className="navbar-mobile bg-gradient-to-r from-[#003E50] to-[#5AA088] p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="logo-container relative w-28 h-28 group"
          >
            <div
              className={`absolute inset-0 transition-transform duration-500 ${
                musicPlaying ? "rotate-360" : ""
              }`}
            >
              <img
                src="/assets/logo.png"
                alt="Logo"
                className={`w-full h-full rounded-full transition-transform duration-500 ease-out ${musicPlaying ? 'ring-2 ring-[#FFD700]' : ''}`}
                style={{ transform: musicPlaying ? "rotate(360deg)" : "rotate(0deg)" }}
              />
              {musicPlaying &&
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute transition-opacity duration-300 opacity-100"
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
                        color: musicPlaying ? "#FFD700" : "white",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
          
          {/* Lecteur audio placé à droite du logo */}
          <div className="hidden md:flex ml-4" style={{ width: '240px' }}>
            <AudioPlayer onStatusChange={onMusicStatusChange} />
          </div>
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
            onClick={() => switchLanguage(currentLocale === 'fr' ? 'en' : 'fr')}
          >
            {currentLocale === "fr" ? (
              <ReactCountryFlag countryCode="FR" svg style={{ width: "24px", height: "24px" }} title="Français" />
            ) : (
              <ReactCountryFlag countryCode="GB" svg style={{ width: "24px", height: "24px" }} title="English" />
            )}
          </button>
        </div>

        <div className="md:hidden flex items-center">
          <button
            className="text-white ml-4 py-2 px-4 rounded-lg border border-white hover:bg-[#FFD700] hover:text-[#003E50] transition duration-300 ease-in-out"
            onClick={() => switchLanguage(currentLocale === 'fr' ? 'en' : 'fr')}
          >
            {currentLocale === "fr" ? (
              <ReactCountryFlag countryCode="FR" svg style={{ width: "24px", height: "24px" }} title="Français" />
            ) : (
              <ReactCountryFlag countryCode="GB" svg style={{ width: "24px", height: "24px" }} title="English" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none"
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Lecteur audio fixe pour mobile (visible même quand le menu est fermé) */}
      <div className="md:hidden w-full px-4 mt-2">
        <AudioPlayer onStatusChange={onMusicStatusChange} />
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 mobile-menu" style={{ position: "relative", zIndex: 20 }}>
          <div className="flex flex-col space-y-3 text-white font-semibold">
            {/* Séparateur */}
            <div className="h-px w-full bg-white/20 my-1"></div>
            
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

      <style>{`
        @keyframes rotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rotate-360 {
          animation: rotate360 3s linear infinite;
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