import { useEffect } from 'react';

const SEO = ({ 
  title = "Adway - Premium Branding & Digital Marketing Agency",
  description = "Adway is a leading branding agency specializing in digital marketing, creative branding, web development, and strategic consulting.",
  keywords = "branding agency, digital marketing, web development, creative branding, marketing strategy",
  image = "/og-image.jpg",
  url = "",
  type = "website",
  structuredData = null
}) => {
  const siteUrl = "https://adway.agency";
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

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
    updateMetaTag('meta[property="og:image"]', image);

    // Twitter tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:url"]', pageUrl);
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', image);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

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

  }, [title, description, keywords, image, pageUrl, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEO;
