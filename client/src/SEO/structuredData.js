const SITE_URL = "https://adwaycreations.com";
const SITE_NAME = "Adway Creations";
const BUSINESS_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Adway Building, 23/7, near Vi Office",
  addressLocality: "Kattappana",
  addressRegion: "Kerala",
  postalCode: "685508",
  addressCountry: "IN",
};

/**
 * Organization Schema
 * Use on: Home, About, Services, Contact, etc.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.png`,
  },
};

/**
 * Website Schema
 * Mainly use on Home page.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

/**
 * WebPage Schema
 * Use for normal static pages.
 *
 * Example:
 * About
 * Services
 * Social
 * Clients
 * Career
 * Contact
 */
export const createWebPageSchema = ({
  name,
  description,
  url,
  image,
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  description,
  url,

  ...(image && {
    image,
  }),

  isPartOf: {
    "@id": `${SITE_URL}/#website`,
  },

  about: {
    "@id": `${SITE_URL}/#organization`,
  },
});

/**
 * Article Schema
 * Use on BlogDetail.jsx
 */
export const createArticleSchema = ({
  title,
  description,
  image,
  slug,
  datePublished,
  dateModified,
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",

  headline: title,
  description,

  ...(image && {
    image: [image],
  }),

  ...(datePublished && {
    datePublished,
  }),

  ...(dateModified && {
    dateModified,
  }),

  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },

  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
    },
  },

  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/blog/${slug}`,
  },
});

/**
 * Breadcrumb Schema
 * Use on internal pages.
 *
 * Example:
 * Home → Services
 * Home → Blog → Article
 */
export const createBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",

  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Service Schema
 * Use on Services.jsx
 */
export const createServiceSchema = ({
  name,
  description,
  url,
  image,
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",

  name,
  description,

  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },

  ...(url && {
    url,
  }),

  ...(image && {
    image,
  }),
});

/**
 * CreativeWork Schema
 * Use for PortfolioDetail.jsx
 */
export const createCreativeWorkSchema = ({
  name,
  description,
  image,
  slug,
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",

  name,
  description,

  ...(image && {
    image: [image],
  }),

  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },

  url: `${SITE_URL}/portfolio/${slug}`,
});

/**
 * Local Business Schema
 *
 * IMPORTANT:
 * Replace the placeholder fields with your REAL business details
 * before using this schema.
 */
export const localBusinessSchema = ({
  address = BUSINESS_ADDRESS,
  telephone = "+91 8606880634",
  email = "adwaycreations@gmail.com",
}) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",

  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  priceRange: "$$",
  areaServed: [
    {
      "@type": "City",
      name: "Kattappana",
    },
    {
      "@type": "State",
      name: "Kerala",
    },
  ],

  ...(telephone && {
    telephone,
  }),

  ...(email && {
    email,
  }),

  ...(address && {
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
  }),
});