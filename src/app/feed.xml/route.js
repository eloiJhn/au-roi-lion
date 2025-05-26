export async function GET() {
  const baseUrl = 'https://www.auroilion.com';
  const currentDate = new Date().toISOString();

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Au Roi Lion - Appartement de Luxe à Dijon</title>
    <description>Découvrez notre appartement de prestige du XVIIe siècle au cœur de Dijon. Vue imprenable sur l'église Saint Michel, décoration raffinée et prestations haut de gamme.</description>
    <link>${baseUrl}</link>
    <language>fr-FR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/assets/logo.png</url>
      <title>Au Roi Lion</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>Appartement de Luxe Au Roi Lion - Séjour Exceptionnel à Dijon</title>
      <description>Vivez l'expérience exceptionnelle d'un séjour dans un appartement du XVIIe siècle. Vue imprenable sur l'église Saint Michel, décoration raffinée vert émeraude et or, prestations haut de gamme.</description>
      <link>${baseUrl}</link>
      <guid isPermaLink="true">${baseUrl}</guid>
      <pubDate>${currentDate}</pubDate>
      <content:encoded><![CDATA[
        <h2>Découvrez l'Appartement Au Roi Lion</h2>
        <p>Situé au cœur du centre historique de Dijon, notre appartement de prestige du XVIIe siècle vous offre une expérience unique.</p>
        <h3>Caractéristiques exceptionnelles :</h3>
        <ul>
          <li>Vue imprenable sur l'église Saint Michel</li>
          <li>Décoration raffinée dans les tons vert émeraude et or</li>
          <li>Appartement historique du XVIIe siècle</li>
          <li>Emplacement privilégié en centre historique</li>
          <li>Prestations haut de gamme</li>
        </ul>
        <p>Réservez dès maintenant sur Airbnb ou Booking.com pour vivre un séjour inoubliable en Bourgogne.</p>
      ]]></content:encoded>
    </item>
    
    <item>
      <title>Centre Historique de Dijon - Emplacement Privilégié</title>
      <description>Notre appartement bénéficie d'un emplacement exceptionnel au cœur du centre historique de Dijon, à proximité de tous les sites touristiques majeurs.</description>
      <link>${baseUrl}#location</link>
      <guid isPermaLink="true">${baseUrl}#location</guid>
      <pubDate>${currentDate}</pubDate>
    </item>
    
    <item>
      <title>Décoration Raffinée - Vert Émeraude et Or</title>
      <description>Découvrez notre décoration unique alliant tradition et modernité, avec des tons vert émeraude et or qui créent une atmosphère royale et élégante.</description>
      <link>${baseUrl}#decoration</link>
      <guid isPermaLink="true">${baseUrl}#decoration</guid>
      <pubDate>${currentDate}</pubDate>
    </item>
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
} 