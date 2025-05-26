import Script from 'next/script';

export function Reviews() {
  const reviews = [
    {
      author: "Marie Dubois",
      rating: 5,
      text: "Appartement absolument magnifique ! La décoration est raffinée et la vue sur l'église Saint Michel est à couper le souffle. Emplacement parfait pour découvrir Dijon.",
      date: "2024-01-15"
    },
    {
      author: "Jean-Pierre Martin",
      rating: 5,
      text: "Séjour exceptionnel dans ce superbe appartement du XVIIe siècle. Tout est parfait : la décoration, l'emplacement, la propreté. Je recommande vivement !",
      date: "2024-01-10"
    },
    {
      author: "Sophie Laurent",
      rating: 5,
      text: "Un véritable coup de cœur ! L'appartement Au Roi Lion allie charme historique et confort moderne. La vue sur l'église est magique, surtout le soir.",
      date: "2024-01-05"
    },
    {
      author: "Thomas Rousseau",
      rating: 4,
      text: "Très bel appartement au cœur de Dijon. Décoration soignée et emplacement idéal pour visiter la ville. Quelques petits détails à améliorer mais globalement excellent.",
      date: "2023-12-28"
    },
    {
      author: "Catherine Moreau",
      rating: 5,
      text: "Appartement de rêve ! Nous avons passé un week-end merveilleux. La décoration vert émeraude et or est somptueuse. Parfait pour un séjour romantique.",
      date: "2023-12-20"
    }
  ];

  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);

  const reviewsStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Au Roi Lion - Appartement de Luxe",
    "description": "Appartement de prestige du XVIIe siècle au cœur de Dijon",
    "image": "https://www.auroilion.com/assets/logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text,
      "datePublished": review.date
    }))
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
    ));
  };

  return (
    <>
      <Script
        id="reviews-structured-data"
        type="application/ld+json"
        strategy="afterInteraction"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewsStructuredData)
        }}
      />
      
      <section className="reviews-section" itemScope itemType="https://schema.org/Product">
        <meta itemProp="name" content="Au Roi Lion - Appartement de Luxe" />
        <meta itemProp="description" content="Appartement de prestige du XVIIe siècle au cœur de Dijon" />
        <meta itemProp="image" content="https://www.auroilion.com/assets/logo.png" />
        
        <h2>Avis de nos Clients</h2>
        
        <div className="aggregate-rating" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <div className="rating-summary">
            <span className="rating-value" itemProp="ratingValue">{averageRating}</span>
            <div className="stars">{renderStars(Math.round(parseFloat(averageRating)))}</div>
            <span className="review-count">({reviews.length} avis)</span>
            <meta itemProp="reviewCount" content={reviews.length.toString()} />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="worstRating" content="1" />
          </div>
        </div>

        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-item" itemProp="review" itemScope itemType="https://schema.org/Review">
              <div className="review-header">
                <span className="author" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{review.author}</span>
                </span>
                <div className="rating" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <div className="stars">{renderStars(review.rating)}</div>
                  <meta itemProp="ratingValue" content={review.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                </div>
                <time className="date" itemProp="datePublished" dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString('fr-FR')}
                </time>
              </div>
              <p className="review-text" itemProp="reviewBody">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
} 