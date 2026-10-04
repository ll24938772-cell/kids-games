/* 遊戲樂園入口的服務工作者：安裝時把入口頁＋數學遊戲＋蛛絲飛簷一起存進裝置。
   平常網路優先（更新會自動生效），斷網時用快取。 */
const CACHE='park-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png',
  './math/','./math/index.html','./math/manifest.webmanifest','./math/icon-180.png',
  './spider/','./spider/index.html','./spider/manifest.webmanifest','./spider/icon-180.png',
  './draw/','./draw/index.html','./draw/manifest.webmanifest','./draw/icon-180.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(u=>c.add(new Request(u,{cache:'reload'}))))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(u.origin!==location.origin||e.request.method!=='GET') return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return res; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
});
