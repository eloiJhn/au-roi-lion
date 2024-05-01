// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%)" }}>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Merienda+One&display=swap" rel="stylesheet" />
      </Head>
      <div className="pt-4 px-4 flex justify-between items-center">
        <img src="/assets/logo.png" alt="logo site" className="w-20 h-20 rounded-full"></img>
        <div className="text-center flex-grow">
          <h1 className="text-6xl font-bold" style={{ fontFamily: "'Merienda One', cursive", color: "#333" }}>Au Roi Lion</h1>
        </div>
        <div style={{ width: "80px" }}></div> {/* Placeholder pour l'équilibre visuel */}
      </div>
      {/* <p className="text-xl mt-4" style={{ color: "#555" }}>Tourné vers les amoureux de l'histoire, du patrimoine et des passionnés de la gastronomie et du vin, 
      ce logement affiche un style résolument unique. 
      En plein coeur de Dijon, cet endroit de charme vous séduira par son authenticité, son confort et ses prestations raffinées. 
      Chaque pièce invite à la rêverie et aux souvenirs d'antan dans ce lieu chargé d'histoire.</p> */}
      {/* Inclure d'autres éléments ici, comme des images ou des informations */}
    </div>
  );
}
