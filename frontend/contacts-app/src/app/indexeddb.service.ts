import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB, IDBPDatabase } from 'idb';
import { Contact } from './contact.service';

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.dbPromise = openDB('ContactsDB', 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('contacts')) {
            db.createObjectStore('contacts', { keyPath: '_id' });
          }
        },
      });
    }
  }

  private async getDB() {
    if (!this.dbPromise) throw new Error('IndexedDB not available');
    return this.dbPromise;
  }

  async saveContact(contact: Contact) {
    const db = await this.getDB();
    if (!contact._id) contact._id = this.generateId();
    const tx = db.transaction('contacts', 'readwrite');
    await tx.objectStore('contacts').put(contact);
    await tx.done;
  }

  async saveContacts(contacts: Contact[]) {
    const db = await this.getDB();
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    for (const c of contacts) {
      if (!c._id) c._id = this.generateId();
      await store.put(c);
    }
    await tx.done;
  }

  async getContacts(): Promise<Contact[]> {
    const db = await this.getDB();
    return db.getAll('contacts');
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const db = await this.getDB();
    return db.get('contacts', id);
  }

  async deleteContact(id: string) {
    const db = await this.getDB();
    const tx = db.transaction('contacts', 'readwrite');
    await tx.objectStore('contacts').delete(id);
    await tx.done;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}
