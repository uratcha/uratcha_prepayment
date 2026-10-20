// sw.js - 모바일 브라우저 알림 지원 및 서비스 워커
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 알림창 클릭 시 앱으로 이동 및 포커싱 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const docId = event.notification.tag;
  const targetUrl = new URL('/', self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 1. 이미 열려 있는 창이 있다면 해당 창으로 포커싱 및 메시지 전송
      for (const client of clientList) {
        if (client.url.startsWith(targetUrl) && 'focus' in client) {
          return client.focus().then((focusedClient) => {
            if (focusedClient && docId) {
              focusedClient.postMessage({ action: 'openPrepayment', docId: docId });
            }
          });
        }
      }
      // 2. 열려 있는 창이 없다면 새 창 열기
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
