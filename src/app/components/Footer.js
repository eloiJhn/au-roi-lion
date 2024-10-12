import React, { useContext } from 'react';
import { TranslationContext } from '../utils/TranslationContext';

export function Footer() {
  const { messages } = useContext(TranslationContext);

  return (
    <footer className="bg-gradient-to-r from-[#003E50] to-[#5AA088] p-8 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <p className="text-lg font-semibold tracking-wide uppercase mb-2">
            {messages.Footer?.contactInfo || "Coordonnées de contact :"}
          </p>
          <p className="text-sm mb-1">
            Email: {" "}
            <a
              href="mailto:au-roi-lion@outlook.com"
              className="underline text-[#FFD700] hover:text-white transition duration-300 ease-in-out"
            >
              au-roi-lion@outlook.com
            </a>
          </p>
          <p className="text-sm">
            Tél : {" "}
            <a
              href="tel:076100601"
              className="underline text-[#FFD700] hover:text-white transition duration-300 ease-in-out"
            >
              076100601
            </a>
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end space-x-6">
          <a
            href="#photos-section"
            className="text-gray-200 hover:text-[#FFD700] transition duration-300 ease-in-out tracking-wide uppercase"
            style={{ letterSpacing: '1.5px' }}
          >
            {messages.Footer?.photos || "Photos"}
          </a>
          <a
            href="#history-section"
            className="text-gray-200 hover:text-[#FFD700] transition duration-300 ease-in-out tracking-wide uppercase"
            style={{ letterSpacing: '1.5px' }}
          >
            {messages.Footer?.history || "Histoire"}
          </a>
          <a
            href="#link-section"
            className="text-gray-200 hover:text-[#FFD700] transition duration-300 ease-in-out tracking-wide uppercase"
            style={{ letterSpacing: '1.5px' }}
          >
            {messages.Footer?.links || "Lien"}
          </a>
          <a
            href="#contact-form"
            className="text-gray-200 hover:text-[#FFD700] transition duration-300 ease-in-out tracking-wide uppercase"
            style={{ letterSpacing: '1.5px' }}
          >
            {messages.Footer?.contact || "Contact"}
          </a>
        </div>
      </div>
    </footer>
  );
}