import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SyncQueueItem {
  id: string;
  type: 'recipe' | 'user' | 'diet' | 'preference';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly DB_NAME = 'FoodPrintEduDB';
  private readonly DB_VERSION = 1;
  private readonly SYNC_QUEUE_STORE = 'syncQueue';
  private readonly OFFLINE_DATA_STORE = 'offlineData';

  private db: IDBDatabase | null = null;
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$: Observable<boolean> = this.isOnlineSubject.asObservable();

  constructor() {
    this.initDB();
    this.setupOnlineListener();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.SYNC_QUEUE_STORE)) {
          const syncStore = db.createObjectStore(this.SYNC_QUEUE_STORE, { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains(this.OFFLINE_DATA_STORE)) {
          const offlineStore = db.createObjectStore(this.OFFLINE_DATA_STORE, { keyPath: 'key' });
          offlineStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('Connection to the internet restored');
      this.isOnlineSubject.next(true);
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      console.log('Connection to the internet lost');
      this.isOnlineSubject.next(false);
    });
  }

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    if (!this.db) await this.initDB();

    const queueItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
      const request = store.add(queueItem);

      request.onsuccess = () => {
        console.log('Added to sync queue:', queueItem);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveOfflineData(key: string, type: string, data: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.OFFLINE_DATA_STORE], 'readwrite');
      const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
      const request = store.put({ key, type, data, timestamp: Date.now() });

      request.onsuccess = () => {
        console.log('Saved offline data:', key);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineData(key: string): Promise<any> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.OFFLINE_DATA_STORE], 'readonly');
      const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllOfflineDataByType(type: string): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.OFFLINE_DATA_STORE], 'readonly');
      const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result.map(item => item.data));
      request.onerror = () => reject(request.error);
    });
  }

  async syncPendingChanges(): Promise<void> {
    if (!this.db || !navigator.onLine) return;

    const items = await this.getSyncQueue();
    console.log(`Synchronizing ${items.length} changes...`);

    for (const item of items) {
      try {
        await this.syncItem(item);
        await this.removeFromSyncQueue(item.id);
        console.log('Synchronized:', item);
      } catch (error) {
        console.error('Synchronization error:', error);
        await this.incrementRetries(item.id);
      }
    }
  }

  private async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    console.log('Synchronizing item:', item);
  }

  private async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async incrementRetries(id: string): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retries += 1;
          if (item.retries >= 5) {
            store.delete(id);
            console.warn('Removed from queue after 5 failed attempts:', item);
          } else {
            store.put(item);
          }
        }
        resolve();
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.SYNC_QUEUE_STORE, this.OFFLINE_DATA_STORE], 'readwrite');
    transaction.objectStore(this.SYNC_QUEUE_STORE).clear();
    transaction.objectStore(this.OFFLINE_DATA_STORE).clear();
    console.log('Cleared all offline data');
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
