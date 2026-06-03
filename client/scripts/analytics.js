export const pageview = (url) => {
  window.gtag('config', 'G-79STGFR2WQ', {
    page_path: url,
  });
};