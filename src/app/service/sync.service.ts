import { Injectable, Injector } from '@angular/core';
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
  private dbInitPromise: Promise<void> | null = null;
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$: Observable<boolean> = this.isOnlineSubject.asObservable();

  constructor(private injector: Injector) {
    this.initDB();
    this.setupOnlineListener();
  }

  private async initDB(): Promise<void> {
    if (this.dbInitPromise) {
      return this.dbInitPromise;
    }

    if (this.db && !this.isDatabaseClosed(this.db)) {
      return Promise.resolve();
    }

    this.dbInitPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        this.dbInitPromise = null;
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;

        this.db.onclose = () => {
          console.warn('IndexedDB connection closed unexpectedly');
          this.db = null;
          this.dbInitPromise = null;
        };
        
        this.db.onversionchange = () => {
          console.warn('IndexedDB version change detected');
          this.db?.close();
          this.db = null;
          this.dbInitPromise = null;
        };
        
        this.dbInitPromise = null;
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

    return this.dbInitPromise;
  }

  private isDatabaseClosed(db: IDBDatabase): boolean {
    try {
      const _ = db.objectStoreNames;
      return false;
    } catch (e) {
      return true;
    }
  }

  private async ensureDatabase(): Promise<IDBDatabase> {
    if (!this.db || this.isDatabaseClosed(this.db)) {
      await this.initDB();
    }
    
    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    
    return this.db;
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
    try {
      const db = await this.ensureDatabase();

      const queueItem: SyncQueueItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        retries: 0
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
        const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
        const request = store.add(queueItem);

        request.onsuccess = () => {
          console.log('Added to sync queue:', queueItem);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
      throw error;
    }
  }

  async saveOfflineData(key: string, type: string, data: any): Promise<void> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.OFFLINE_DATA_STORE], 'readwrite');
        const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
        const request = store.put({ key, type, data, timestamp: Date.now() });

        request.onsuccess = () => {
          console.log('Saved offline data:', key);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to save offline data:', error);
      throw error;
    }
  }

  async getOfflineData(key: string): Promise<any> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.OFFLINE_DATA_STORE], 'readonly');
        const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result?.data);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }

  async getAllOfflineDataByType(type: string): Promise<any[]> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.OFFLINE_DATA_STORE], 'readonly');
        const store = transaction.objectStore(this.OFFLINE_DATA_STORE);
        const index = store.index('type');
        const request = index.getAll(type);

        request.onsuccess = () => resolve(request.result.map(item => item.data));
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get offline data by type:', error);
      return [];
    }
  }

  async syncPendingChanges(): Promise<void> {
    if (!navigator.onLine) return;

    try {
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
    } catch (error) {
      console.error('Failed to sync pending changes:', error);
    }
  }

  private async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.SYNC_QUEUE_STORE], 'readonly');
        const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    console.log('Synchronizing item:', item);
    
    if (item.type === 'recipe' && item.action === 'create') {
      await this.syncMealPreparation(item.data);
      return;
    }
    
    throw new Error(`Sync handler not implemented for type: ${item.type}, action: ${item.action}`);
  }
  
  private async syncMealPreparation(data: { recipeId: number; servings: number }): Promise<void> {
    // Lazy load RecipeService to avoid circular dependency
    const { RecipeService } = await import('./recipe.service');
    const recipeService = this.injector.get(RecipeService);
    
    return new Promise((resolve, reject) => {
      recipeService.cookRecipe(data.recipeId, data.servings).subscribe({
        next: (response) => {
          console.log('Meal synced successfully:', response);
          resolve();
        },
        error: (error) => {
          console.error('Failed to sync meal:', error);
          reject(error);
        }
      });
    });
  }
  
  private async removeFromSyncQueue(id: string): Promise<void> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
        const store = transaction.objectStore(this.SYNC_QUEUE_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to remove from sync queue:', error);
    }
  }

  private async incrementRetries(id: string): Promise<void> {
    try {
      const db = await this.ensureDatabase();

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.SYNC_QUEUE_STORE], 'readwrite');
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
    } catch (error) {
      console.error('Failed to increment retries:', error);
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const db = await this.ensureDatabase();

      const transaction = db.transaction([this.SYNC_QUEUE_STORE, this.OFFLINE_DATA_STORE], 'readwrite');
      transaction.objectStore(this.SYNC_QUEUE_STORE).clear();
      transaction.objectStore(this.OFFLINE_DATA_STORE).clear();
      console.log('Cleared all offline data');
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
