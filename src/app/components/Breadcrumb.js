import Script from 'next/script';
import Link from 'next/link';

export function Breadcrumb({ items = [] }) {
  const defaultItems = [
    { name: 'Accueil', url: 'https://www.auroilion.com' },
    ...items
  ];

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": defaultItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <>
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        strategy="afterInteraction"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      
      <nav aria-label="Fil d'Ariane" className="breadcrumb">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {defaultItems.map((item, index) => (
            <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {index < defaultItems.length - 1 ? (
                <Link href={item.url} itemProp="item">
                  <span itemProp="name">{item.name}</span>
                </Link>
              ) : (
                <span itemProp="name" aria-current="page">{item.name}</span>
              )}
              <meta itemProp="position" content={index + 1} />
              {index < defaultItems.length - 1 && <span className="separator"> › </span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
} 