self.addEventListener('sync', (event) => {
  console.log('Background Sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(syncPendingData());
  }
});

self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'FoodPrintEdu';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'view' || event.action === 'open' || !event.action) {
    const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUntracked: true })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

async function syncPendingData() {
  console.log('Sync data started');

  try {
    const db = await openDB();
    const items = await getAllSyncItems(db);

    for (const item of items) {
      try {
        await syncItem(item);
        await removeSyncItem(db, item.id);
        console.log('Synchronized:', item);
      } catch (error) {
        console.error('Sync error:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FoodPrintEduDB', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllSyncItems(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function syncItem(item) {
  const response = await fetch(`/api/${item.type}/${item.action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item.data)
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`);
  }
}

function removeSyncItem(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

console.log('Custom Service Worker loaded');
