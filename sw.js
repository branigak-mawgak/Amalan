/* Amalan RC80 iPad RC86 - offline app + media/PDF dependency cache */
const CACHE='amalan-rc80-rc86-v1';
const MEDIA_CACHE='amalan-rc80-media-rc86';
const PDFJS=[
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];
const ASSETS=['./','./index.html','./Amalan_RC80.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const c=await caches.open(CACHE); await c.addAll(ASSETS);
  // Best-effort warmup: never fail installation if a CDN is temporarily unavailable.
  const ext=await caches.open(MEDIA_CACHE);
  await Promise.all(PDFJS.map(async u=>{try{const r=await fetch(u,{mode:'cors'});if(r.ok)await ext.put(u,r.clone())}catch(e){}}));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('amalan-rc80-')&&k!==CACHE&&k!==MEDIA_CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(r=>{if(r?.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match('./index.html')));return;
 }
 // PDF.js CDN: cache-first after the first online warmup/use.
 if(PDFJS.includes(url.href)){
  event.respondWith(caches.open(MEDIA_CACHE).then(async c=>{
   const hit=await c.match(req)||await c.match(url.href); if(hit)return hit;
   const r=await fetch(req); if(r?.ok)await c.put(req,r.clone()); return r;
  }));return;
 }
 // Built-in media paths: cache first and retain successful online responses.
 if(url.origin===location.origin && url.pathname.includes('/media/')){
  event.respondWith(caches.open(MEDIA_CACHE).then(async c=>{
   const hit=await c.match(req); if(hit)return hit;
   const r=await fetch(req); if(r?.ok)await c.put(req,r.clone()); return r;
  }));return;
 }
 if(url.origin!==location.origin)return;
 event.respondWith(caches.match(req).then(async hit=>{
  if(hit)return hit;
  const r=await fetch(req);if(r?.ok){const c=await caches.open(CACHE);await c.put(req,r.clone())}return r;
 }).catch(()=>caches.match('./index.html')));
});
