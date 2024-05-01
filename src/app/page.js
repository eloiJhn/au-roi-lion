'use client';

import Head from "next/head";
import { useState } from 'react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%)" }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Merienda+One&display=swap" rel="stylesheet" />
      </Head>
      <div className="pt-4 px-4 flex justify-between items-center">
        <img src="/assets/logo.png" alt="logo site" className="w-20 h-20 rounded-full"></img>
        <div className="text-center md:text-left md:w-full"> {/* Center text on small screens, left align on larger screens, w-full for full width */}
          <h1 className="text-6xl font-bold" style={{ fontFamily: "'Merienda One', cursive", color: "#333" }}>Au Roi Lion</h1>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="#photos" className="text-gray-500">Photos</a>
          <a href="#histoire" className="text-gray-500">Histoire</a>
          <a href="#lien" className="text-gray-500">Lien</a>
          <a href="#contact" className="text-gray-500">Contact</a>
        </div>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-18 right-2 bg-white shadow-lg rounded-lg p-2">
          <a href="#photos" className="block p-2 text-gray-500">Photos</a>
          <a href="#histoire" className="block p-2 text-gray-500">Histoire</a>
          <a href="#lien" className="block p-2 text-gray-500">Lien</a>
          <a href="#contact" className="block p-2 text-gray-500">Contact</a>
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
        <p className="text-xl text-center text-gray-700">Tourné vers les amoureux de l'histoire, du patrimoine et des passionnés de la gastronomie et du vin, 
        ce logement affiche un style résolument unique. 
        En plein coeur de Dijon, cet endroit de charme vous séduira par son authenticité, son confort et ses prestations raffinées. 
        Chaque pièce invite à la rêverie et aux souvenirs d'antan dans ce lieu chargé d'histoire.</p>
      </div>
    </div>
  );
}
