importScripts('./workbox-sw.prod.js');

const wb = new self.WorkboxSW({ clientsClaim: true, skipWaiting: true });

wb.precache([]); // workbox injects manifest for static files here
wb.router.registerNavigationRoute('index.html', { whitelist: [/./] });
