import Image from 'next/image';

export function SEOImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) {
  // Générer des alt texts descriptifs pour le SEO
  const generateSEOAlt = (src, alt) => {
    if (alt) return alt;
    
    const filename = src.split('/').pop().split('.')[0];
    const seoDescriptions = {
      'salon': 'Salon élégant de l\'appartement Au Roi Lion avec vue sur l\'église Saint Michel à Dijon',
      'chambre': 'Chambre luxueuse du XVIIe siècle dans l\'appartement Au Roi Lion à Dijon',
      'cuisine': 'Cuisine équipée moderne dans l\'appartement historique Au Roi Lion',
      'douche': 'Salle de bain moderne avec douche dans l\'appartement Au Roi Lion',
      'vue': 'Vue imprenable sur l\'église Saint Michel depuis l\'appartement Au Roi Lion',
      'couloir': 'Couloir décoré avec goût dans l\'appartement du XVIIe siècle Au Roi Lion',
      'lavabo': 'Lavabo élégant dans la salle de bain de l\'appartement Au Roi Lion',
      'deco': 'Décoration raffinée vert émeraude et or de l\'appartement Au Roi Lion',
      'logo': 'Logo Au Roi Lion - Lion élégant en costume vert, symbole de l\'appartement de luxe à Dijon'
    };
    
    return seoDescriptions[filename] || `Image de l'appartement Au Roi Lion à Dijon - ${filename}`;
  };

  const seoAlt = generateSEOAlt(src, alt);

  return (
    <Image
      src={src}
      alt={seoAlt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
} 