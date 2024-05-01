// pages/index.js
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%)" }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Merienda+One&display=swap" rel="stylesheet" />
      </Head>
      <div className="pt-8 text-center px-4">
        <h1 className="text-6xl font-bold" style={{ fontFamily: "'Merienda One', cursive", color: "#333" }}>Au Roi Lion</h1>
        {/* Inclure d'autres éléments ici, comme des images ou des informations */}
      </div>
    </div>
  );
}
