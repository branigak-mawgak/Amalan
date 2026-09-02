/* Amalan RC91 - iPad offline-first service worker */
const VERSION='amalan-rc91-offline-v1';
const SHELL=[
 './','./index.html','./Amalan_RC80.html','./manifest.webmanifest',
 './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'
];
const PDFJS=[
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 const c=await caches.open(VERSION);
 for(const u of SHELL){try{await c.add(u)}catch(err){console.warn('shell cache failed',u,err)}}
 // Optional dependencies: do not block installation.
 await Promise.all(PDFJS.map(async u=>{try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r.clone())}catch(_){}}));
 await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('amalan-')&&k!==VERSION).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
async function shell(){const c=await caches.open(VERSION);return (await c.match('./index.html'))||(await c.match('/index.html'));}
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(r.mode==='navigate'){
  e.respondWith((async()=>{const c=await caches.open(VERSION);const hit=await c.match(r);if(hit)return hit;try{const net=await fetch(r);if(net.ok)c.put(r,net.clone());return net}catch(_){return await shell()}})());return;
 }
 e.respondWith((async()=>{
  const c=await caches.open(VERSION);const hit=await c.match(r)||await c.match(u.href);if(hit)return hit;
  try{const net=await fetch(r);if(net&&net.ok)c.put(r,net.clone());return net}catch(err){
   if(u.origin===location.origin)return new Response('',{status:503,statusText:'Offline'});
   throw err;
  }
 })());
});
