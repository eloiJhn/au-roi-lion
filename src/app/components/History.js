import React, { useContext } from "react";
import {
  KeyIcon,
  SunIcon,
  MoonIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { TranslationContext } from "../utils/TranslationContext";

export function Section3() {
  const { messages } = useContext(TranslationContext);

  const sectionContent = [
    {
      Icon: KeyIcon,
      text:
        messages.Section3?.title2 ||
        "Dès que vous franchissez la porte, vous êtes accueilli par des touches de décoration élégantes intégrées à un magnifique appartement du 17ème siècle.",
    },
    {
      Icon: InformationCircleIcon,
      text:
        messages.Section3?.title3 ||
        "La cuisine moderne, toute équipée, vous permettra de concocter des spécialités dijonnaises et de découvrir les meilleurs vins de la région et des crémants de Bourgogne.",
    },
    {
      Icon: SunIcon,
      text:
        messages.Section3?.title4 ||
        "Un superbe salon du 17ème, lumineux et chaleureux, vous attend pour vous laisser aller à la rêverie et au repos.",
    },
    {
      Icon: MoonIcon,
      text:
        messages.Section3?.title5 ||
        "La chambre avec un grand lit double ainsi qu'un vaste dressing et sa salle de bain attenante équipée d'une grande douche à l'italienne, sauront vous replonger dans le monde féérique du XVIIe siècle.",
    },
    {
      Icon: ShoppingBagIcon,
      text:
        messages.Section3?.title6 ||
        "Idéalement situé en plein cœur historique de Dijon, \"Au Roi Lion\" offre un accès facile aux boutiques et commerces locaux tout en étant un refuge paisible après une journée d'exploration et de visites.",
    },
  ];

  return (
    <div
      id="history-section"
      className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg border border-8 border-double"
      style={{ borderColor: "#003E50 #5AA088" }}
    >
      <div className="p-4">
        <GradientText
          text={
            messages.Section3?.title1 ||
            "Sa majesté vous invite à contempler l'église Saint Michel du XVIe siècle, célèbre par sa façade Renaissance et considérée comme l'une des plus belles de France, classée monument historique. Plongez dans une expérience unique où le confort moderne se conjugue au charme de l'ancien dans notre logement soigneusement décoré qui vous transporte dans un monde inspiré par la majesté et le raffiné. Chaque pièce invite à la rêverie et aux souvenirs d'antan dans ce lieu chargé d'histoire."
          }
          additionalClasses="text-lg font-lora mb-4"
        />
        <div className="flex flex-col space-y-6">
          {sectionContent.map(({ Icon, text }, index) => (
            <SectionItem key={index} Icon={Icon} text={text} />
          ))}
        </div>
        <GradientText
          text={
            messages.Section3?.title7 ||
            "Réservez dès maintenant et vivez une expérience locative qui éveillera vos sens et émerveillera votre esprit. \"Au Roi Lion\" est bien plus qu'un logement, c'est une aventure mémorable, un voyage au cœur de la cité historique Dijonnaise."
          }
          additionalClasses="mt-8 text-gray-600 text-lg font-semibold font-lora"
        />
      </div>
    </div>
  );
}

const SectionItem = ({ Icon, text }) => (
  <div className="flex items-center space-x-4">
    <Icon className="h-6 w-6 text-gray-700 hover:text-[#FFD700] transition-colors duration-300" />
    <GradientText text={text} additionalClasses="text-gray-600 text-lg font-lora" />
  </div>
);

const GradientText = ({ text, additionalClasses }) => (
  <p
    className={`${additionalClasses}`}
    style={{
      background: "linear-gradient(to right, #003E50, #5AA088)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {text}
  </p>
);
