// src/app/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  _id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  cell?: string;
  registered: Date | string;
  age: number;
  picture: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  create(contact: Contact): Observable<Contact> {
    const { _id, ...payload } = contact;
    return this.http.post<Contact>(this.apiUrl, payload);
  }

  update(id: string, contact: Contact): Observable<Contact> {
    const { _id: _, ...payload } = contact;
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}