import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB } from 'idb';

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbPromise: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      // Only initialize IndexedDB in browser
      this.dbPromise = openDB('ContactsDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('contacts')) {
            db.createObjectStore('contacts', { keyPath: 'id' });
          }
        }
      });
    }
  }

  async saveContacts(contacts: any[]) {
    if (!this.dbPromise) return; // SSR safe

    const db = await this.dbPromise;
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');

    for (const c of contacts) {
      await store.put(c);
    }

    await tx.done;
  }

  async getContacts() {
    if (!this.dbPromise) return []; 
    const db = await this.dbPromise;
    return db.getAll('contacts');
}
}
