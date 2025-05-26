import Script from 'next/script';

export function FAQ() {
  const faqs = [
    {
      question: "Où se situe l'appartement Au Roi Lion ?",
      answer: "L'appartement Au Roi Lion est situé au cœur du centre historique de Dijon, avec une vue imprenable sur l'église Saint Michel. Il se trouve dans un bâtiment du XVIIe siècle, à proximité de tous les sites touristiques majeurs de Dijon."
    },
    {
      question: "Quels sont les équipements disponibles dans l'appartement ?",
      answer: "L'appartement dispose d'une décoration raffinée dans les tons vert émeraude et or, d'une cuisine équipée moderne, d'une salle de bain avec douche, et de prestations haut de gamme. Vous bénéficierez également d'une vue exceptionnelle sur l'église Saint Michel."
    },
    {
      question: "Comment réserver l'appartement Au Roi Lion ?",
      answer: "Vous pouvez réserver l'appartement Au Roi Lion directement sur Airbnb ou Booking.com. Les liens de réservation sont disponibles sur notre site web. Les horaires de check-in sont à partir de 15h00 et le check-out avant 11h00."
    },
    {
      question: "L'appartement accepte-t-il les animaux de compagnie ?",
      answer: "Non, l'appartement Au Roi Lion n'accepte pas les animaux de compagnie afin de préserver la qualité et la propreté de ce logement de prestige."
    },
    {
      question: "Peut-on fumer dans l'appartement ?",
      answer: "Non, il est interdit de fumer dans l'appartement Au Roi Lion. Ceci permet de maintenir un environnement sain et agréable pour tous nos hôtes."
    },
    {
      question: "Quels sont les sites touristiques à proximité ?",
      answer: "L'appartement est idéalement situé pour découvrir Dijon et la Bourgogne. Vous êtes à quelques pas de l'église Saint Michel, du centre historique, des musées, restaurants gastronomiques et des caves à vin de Bourgogne."
    }
  ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        strategy="afterInteraction"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData)
        }}
      />
      
      <section className="faq-section" itemScope itemType="https://schema.org/FAQPage">
        <h2>Questions Fréquemment Posées</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 itemProp="name">{faq.question}</h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p itemProp="text">{faq.answer}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
} 