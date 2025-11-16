import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IndexedDBService } from './indexeddb.service';

export interface Contact {
  _id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  cell?: string;
  registered: Date | string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';
  private contactsCache: Contact[] | null = null;

  constructor(private http: HttpClient, private idb: IndexedDBService) {}

  // Get contacts (cached if available)
  getAll(): Observable<Contact[]> {
    if (this.contactsCache) return of(this.contactsCache);

    return this.http.get<Contact[]>(this.apiUrl).pipe(
      tap((contacts) => {
        this.contactsCache = contacts;
        this.idb.saveContacts(contacts); // offline caching
      }),
      catchError(async () => {
        const offlineData = await this.idb.getContacts();
        this.contactsCache = offlineData;
        return offlineData;
      })
    );
  }

  getById(id: string): Observable<Contact> {
    if (this.contactsCache) {
      const contact = this.contactsCache.find((c) => c._id === id);
      if (contact) return of(contact);
    }
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  create(contact: Contact): Observable<Contact> {
    const { _id, ...payload } = contact;
    return this.http.post<Contact>(this.apiUrl, payload).pipe(
      tap((newContact) => {
        this.contactsCache = this.contactsCache || [];
        this.contactsCache.push(newContact);
      })
    );
  }

  update(id: string, contact: Contact): Observable<Contact> {
    const { _id, ...payload } = contact;
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, payload).pipe(
      tap((updated) => {
        if (!this.contactsCache) return;
        const index = this.contactsCache.findIndex((c) => c._id === id);
        if (index > -1) this.contactsCache[index] = updated;
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        if (!this.contactsCache) return;
        this.contactsCache = this.contactsCache.filter((c) => c._id !== id);
      })
    );
  }

}
