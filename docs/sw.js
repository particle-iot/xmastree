importScripts('./workbox-sw.prod.js');

const wb = new self.WorkboxSW({ clientsClaim: true, skipWaiting: true });

wb.precache([
  {
    "url": "7ee2597ba400b57e3af8-bundle.js",
    "revision": "1130871cb8f416787a6fbdd0a249fb24"
  },
  {
    "url": "af6e3695c624aca90187-styles.css",
    "revision": "6cb5873e4ed1e7585f7e9c6679a32223"
  },
  {
    "url": "favicon.ico",
    "revision": "35a13e66f26fa5dcdfb90fcc81fb6099"
  },
  {
    "url": "index.html",
    "revision": "04c094b27395a6e8e409eeab1d3e0059"
  },
  {
    "url": "workbox-sw.prod.js",
    "revision": "2a5638f9e33d09efc487b96804a0aa11"
  }
]); // workbox injects manifest for static files here
wb.router.registerNavigationRoute('index.html', { whitelist: [/./] });
