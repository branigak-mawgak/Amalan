const CACHE='rc73-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    const copy=r.clone();
    if(new URL(e.request.url).origin===location.origin) caches.open(CACHE).then(c=>c.put(e.request,copy));
    return r;
  }).catch(()=>caches.match('./index.html'))));
});