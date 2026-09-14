import { useEffect } from 'react';

const SITE_URL = "https://adwaycreations.com";

const SEO = ({
  title = "Adway Creations | Branding & Digital Marketing Agency in Kattappana",
  description = "Adway Creations is a branding and digital marketing agency in Kattappana, Kerala, offering brand strategy, logo design, web development, and creative campaigns.",
  keywords = "branding agency in Kattappana, digital marketing agency in Kattappana, branding agency Kerala, logo design Kattappana, web development Kerala, Adway Creations",
  image = "/og-image.jpg",
  url = "",
  type = "website",
  structuredData = null
}) => {
  const pageUrl = url ? new URL(url, SITE_URL).toString() : `${SITE_URL}/`;
  const imageUrl = new URL(image, SITE_URL).toString();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property')) {
          element.setAttribute('property', selector.split('[')[1].replace(']', ''));
        } else {
          element.setAttribute('name', selector.split('[')[1].replace(']', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    
    // Open Graph tags
    updateMetaTag('meta[property="og:type"]', type);
    updateMetaTag('meta[property="og:url"]', pageUrl);
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:site_name"]', 'Adway Creations');
    updateMetaTag('meta[property="og:image"]', imageUrl);
    updateMetaTag('meta[property="og:image:alt"]', `${title} - Adway Creations`);

    // Twitter tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:url"]', pageUrl);
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', imageUrl);

    // Update canonical link - ensure it's always present and correct
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    // Add hreflang tags for international SEO
    let hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.setAttribute('rel', 'alternate');
      hreflangEn.setAttribute('hreflang', 'en');
      document.head.appendChild(hreflangEn);
    }
    hreflangEn.setAttribute('href', pageUrl);

    // Add x-default hreflang
    let hreflangDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (!hreflangDefault) {
      hreflangDefault = document.createElement('link');
      hreflangDefault.setAttribute('rel', 'alternate');
      hreflangDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute('href', pageUrl);

    // Add self-referencing canonical confirmation
    // Add structured data if provided
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Optional: log when component unmounts
    };

  }, [title, description, keywords, imageUrl, pageUrl, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
