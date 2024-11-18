import React, { useContext } from "react";
import { TranslationContext } from "../utils/TranslationContext";

export function Footer() {
  const { messages } = useContext(TranslationContext);

  const contactDetails = [
    {
      label: messages.Footer?.email || "Email",
      value: "au-roi-lion@outlook.com",
      href: "mailto:au-roi-lion@outlook.com",
    },
    {
      label: messages.Footer?.phone || "Tél",
      value: "076100601",
      href: "tel:076100601",
    },
  ];

  const navigationLinks = [
    { href: "#photos-section", label: messages.Footer?.photos || "Photos" },
    { href: "#history-section", label: messages.Footer?.history || "Histoire" },
    { href: "#link-section", label: messages.Footer?.links || "Lien" },
    { href: "#contact-form", label: messages.Footer?.contact || "Contact" },
  ];

  return (
    <footer className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-8 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <ContactDetails details={contactDetails} title={messages.Footer?.contactInfo || "Coordonnées de contact :"} />

        <NavigationLinks links={navigationLinks} />
      </div>
    </footer>
  );
}

const ContactDetails = ({ details, title }) => (
  <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
    <p className="text-lg font-semibold tracking-wide uppercase mb-2">{title}</p>
    {details.map(({ label, value, href }, index) => (
      <p key={index} className="text-sm mb-1">
        {label}:{" "}
        <a
          href={href}
          className="underline text-[#FFD700] hover:text-white transition duration-300 ease-in-out"
        >
          {value}
        </a>
      </p>
    ))}
  </div>
);

const NavigationLinks = ({ links }) => (
  <div className="md:w-1/2 flex justify-center md:justify-end space-x-6">
    {links.map(({ href, label }, index) => (
      <a
        key={index}
        href={href}
        className="text-gray-200 hover:text-[#FFD700] transition duration-300 ease-in-out tracking-wide uppercase"
        style={{ letterSpacing: "1.5px" }}
      >
        {label}
      </a>
    ))}
  </div>
);
