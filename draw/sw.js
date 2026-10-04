/* 畫畫本：首次開啟就把整個 App 存進裝置；平常網路優先、斷網用快取。圖片本身存在 IndexedDB，不經過這裡 */
const CORE='draw-v1', FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CORE).then(c=>Promise.allSettled(FILES.map(u=>c.add(new Request(u,{cache:'reload'}))))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(u.origin!==location.origin||e.request.method!=='GET') return;
  e.respondWith(fetch(e.request).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CORE).then(c=>c.put(e.request,copy)); } return res; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
});
