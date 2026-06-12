// Service Worker لإشعارات «دورك» — يستقبل Push ويعرض التنبيه ويفتح صفحة التذكرة
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "دورك 🔔", {
      body: data.body || "",
      dir: "rtl",
      lang: "ar",
      tag: "dawrak-queue", // إشعار واحد يحل محل السابق
      renotify: true,
      vibrate: [200, 100, 200, 100, 300],
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
