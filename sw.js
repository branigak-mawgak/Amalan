const CACHE='amalan-rc80-10-offline-v2';
const ASSETS=[
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// PDF.js is cached during the first online installation so the PDF Reader /
// Teleprompter continues working when the Home Screen app is offline.
const PDFJS_REMOTE=[
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

async function cachePdfJs(){
  const cache=await caches.open(CACHE);
  await Promise.all(PDFJS_REMOTE.map(async url=>{
    try{
      const req=new Request(url,{mode:'no-cors',cache:'reload'});
      const res=await fetch(req);
      await cache.put(url,res.clone());
    }catch(e){
      // Do not abort PWA installation if the CDN is temporarily unreachable.
      console.warn('[RC80.10 Offline] PDF.js pre-cache pending:',url,e);
    }
  }));
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    await cachePdfJs();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    // Retry caching PDF.js on activation in case install happened during a brief outage.
    await cachePdfJs();
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data && event.data.type==='CACHE_PDFJS_NOW'){
    event.waitUntil(cachePdfJs());
  }
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const isPdfJs=PDFJS_REMOTE.includes(url.href);

  if(isPdfJs){
    // Cache-first for PDF.js. Network is used only to fill/refresh the cache.
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(url.href);
      if(cached) return cached;
      try{
        const req=new Request(url.href,{mode:'no-cors'});
        const fresh=await fetch(req);
        await cache.put(url.href,fresh.clone());
        return fresh;
      }catch(_){
        return Response.error();
      }
    })());
    return;
  }

  if(event.request.mode==='navigate' || /\/index\.html$/.test(url.pathname) || url.pathname.endsWith('/')){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        const cache=await caches.open(CACHE);
        cache.put('./index.html',fresh.clone()).catch(()=>{});
        return fresh;
      }catch(_){
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try{
      const fresh=await fetch(event.request);
      if(url.origin===self.location.origin){
        const cache=await caches.open(CACHE);
        cache.put(event.request,fresh.clone()).catch(()=>{});
      }
      return fresh;
    }catch(_){
      return Response.error();
    }
  })());
});
