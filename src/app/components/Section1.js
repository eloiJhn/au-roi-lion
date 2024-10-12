import React, {useContext} from 'react';
import { TranslationContext } from "../utils/TranslationContext";


export function Section1() {
  const { currentLocale, messages, switchLanguage } = useContext(TranslationContext);

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 p-4 text-center">
        <h1
          className="text-3xl font-bold"
          style={{
            fontFamily: "'Merienda One', cursive",
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "underline",
            textDecorationColor: "#003E50",
          }}
        >
          {messages.Section1?.title || " Au Roi Lion, magnifique appartement de 60 m2 en location dans le centre historique de Dijon !"}

        </h1>
      </div>

      <div
        id="photos-section"
        className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-8 border-double"
        style={{ borderColor: "#003E50 #5AA088" }}
      >
        <p
          className="text-lg font-lora mb-4 text-center"
          style={{
            background: "linear-gradient(to right, #003E50, #5AA088)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {messages.Section1?.description || "Tourné vers les amoureux de l'histoire, du patrimoine et des passionnés de la gastronomie et du vin, ce logement affiche un style résolument unique. En plein coeur de Dijon, cet endroit de charme vous séduira par son authenticité, son confort et ses prestations raffinées. Chaque pièce invite à la rêverie et aux souvenirs d'antan dans ce lieu chargé d'histoire."}
        </p>
      </div>
    </>
  );
}