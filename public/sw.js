const CACHE='core-v5-ultimate-cache';
const ASSETS=['/','/index.html','/manifest.webmanifest','/assets/logo-core.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('fetch',e=>{
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then(res=> res || fetch(e.request).then(r=>{
        const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy)); return r;
      }).catch(()=>caches.match('/')))
    );
  }
});